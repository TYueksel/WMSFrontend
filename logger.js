(function() {

	const fs = require('fs');
	const schedule = require('node-schedule');
	
	var filename = "logs/" + getFilename();
	
	// flag a: append
	// flag s: synchron
	var stream = fs.createWriteStream(filename, {flags:'as'});
	stream.write("\n" + new Date().toISOString() + ":\tStarting Frontend...\n");
	
	stream.on('error', function (err) {
		console.log("LOGGER ERROR!");
		console.log(err);
	});
	
	schedule.scheduleJob('0 0 0 * * *', function(){
		filename = "logs/" + getFilename();
		
		const newStream = fs.createWriteStream(filename, {flags:'as'});
		stream.end();
		stream = newStream;
	});

	exports.log = function(text) {
		stream.write(new Date().toISOString() + ":\t" + text + "\n");
		console.log(text);
	};
	
	exports.close = function() {
		stream.end();
	};
	
	function getFilename() {
		const date = new Date();
		const year = date.getFullYear();
		var month = date.getMonth()+1;
		if (month < 10) month = "0"+ month;
		var day = date.getDate();
		if (day < 10) day = "0"+ day;
		
		return day + "_" + month + "_" + year + ".txt";
	}

}());
