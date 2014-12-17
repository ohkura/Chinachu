switch (request.method) {
case 'GET':
	switch (request.type) {
	case 'json':
		response.head(200);
		response.end(JSON.stringify(data.recorded));
		break;

	case 'rss':
		var site = 'http://' + request.headers.host + '/';
		var podcast = new Podcast({
			title: 'Chinachu VideoCast',
			description: 'To add a program to this video cast, convert the program into MP4',
			feed_url: site + 'api/recorded.rss',
			site_url: site,
			author: 'Chinachu',
			image_url: site + 'chinachu.png',
			language: 'ja',
			pubDate: new Date().toUTCString(),
			ttl: '60',
		});

		for (i in data.recorded) {
			var program = data.recorded[i];
			var mp4_url = site + 'api/recorded/' + program.id + '/watch.mp4?ext=mp4&c%3Av=copy&c%3Aa=copy&ss=0';
			if (program.mp4 && fs.existsSync(program.mp4)) {
				podcast.item({
					title: program.fullTitle,
					description: program.detail,
					guid: program.id,
					categories: [],
					author: program.channel.name,
					date: program.start,
					enclosure: {url: mp4_url, type:'video/mp4'},
					itunesAuthor: program.channel.name,
					itunesExplicit: false,
					itunesSubtitle: program.detail,
					itunesDuration: program.seconds,
					itunesKeywords: [program.channel.name, program.category,] + program.flags + program.tpes
				});
			}
		}

		response.head(200);
		response.end(podcast.xml());

		break;
	}
	break;

case 'PUT':
	data.recorded = (function() {
		var array = [];
		
		data.recorded.forEach(function(a) {
			if (fs.existsSync(a.recorded)) {
				array.push(a);
			}
		});
		
		return array;
	})();

	fs.writeFileSync(define.RECORDED_DATA_FILE, JSON.stringify(data.recorded));
	
	response.head(200);
	response.end(JSON.stringify(data.recorded, null, '  '));
	break;
}
