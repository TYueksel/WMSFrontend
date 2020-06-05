(function() {
	'use strict';

	var mysql = require('mysql');

	var connection = mysql.createConnection({
		host     : global.sqlHOST,
		user     : global.sqlUSER,
		password : global.sqlPW,
		database : global.sqlDB
	});

	connection.connect(function(err) {
		if (err) {
	    		console.error('error connecting: ' + err.stack);
	    		return;
	  	}
	 
	  	console.log('Connected to database');
	});

	/**
	 * Erstellt einen neuen Trip
	 */
	exports.createNewTrip = function(cb) {
		connection.query("INSERT INTO Trips(start_km) VALUES (null)", function(error, results, fields) {
			if(error) throw error;
			global.old_tripid = null;
			global.tripid = results['insertId'];
			//publishTrip(results['insertId']);
			console.log("NEW Trip " + global.tripid);
			if(cb !== null) {
				cb(results['insertId']);
			}
		});
	};

}());
