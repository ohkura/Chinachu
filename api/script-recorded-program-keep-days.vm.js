(function() {
	
	var program = chinachu.getProgramById(request.param.id, data.recorded);
	
	if (program === null) return response.error(404);
	
	program.isRemoved = !fs.existsSync(program.recorded);
	
	switch (request.method) {
	case 'PUT':
		program.keep_days = request.param.days;
		break;

	case 'DELETE':
		delete program.keep_days;
		break;
	}
	fs.writeFileSync(define.RECORDED_DATA_FILE, JSON.stringify(data.recorded));
	response.head(200);
	response.end('{}');
	return;
})();
