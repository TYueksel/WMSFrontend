(function() {
	'use strict';

	var mysql = require('mysql');

	var connection = mysql.createConnection({
		host     : global.sqlHOST,
		user     : global.sqlUSER,
		password : global.sqlPW,
		database : global.sqlDB,
		multipleStatements: true
	});

	connection.connect(function(err) {
		if (err) {
    		console.error('error connecting: ' + err.stack);
    		return;
	  	}
	 
	  	global.logger.log('Connected to database');
	});

	exports.getData = function(cb) {
		connection.query("SELECT * FROM Users", function(error, results, fields) {
			if(error) throw error;
			
			global.user1.limit = results[0].Limit;
			global.user1.used = results[0].Usage;
			global.user2.used = results[1].Usage;
			global.user2.limit = results[1].Limit;
			
			if(cb !== null) {
				cb();
			}
		});
	};
	
	exports.updateUsage = function() {
		var query = "UPDATE Users SET `Usage` = " + global.user1.used + " WHERE ID = 1; ";
		query += "UPDATE Users SET `Usage` = " + global.user2.used + " WHERE ID = 2;";
		connection.query(query, function(error, results, fields) {
			if(error) throw error;
		});
	};
	
	exports.updateLimits = function() {
		var query = "UPDATE Users SET `Limit` = " + global.user1.limit + " WHERE ID = 1; ";
		query += "UPDATE Users SET `Limit` = " + global.user2.limit + " WHERE ID = 2;";
		connection.query(query, function(error, results, fields) {
			if(error) throw error;
		});
	};
	
	exports.resetDB = function() {
		const query = "UPDATE Users SET `Limit` = 0, `Usage` = 0";
		connection.query(query, function(error, results, fields) {
			if(error) throw error;
		});
	};
	
	exports.endConnection = function() {
		connection.end();
	};

}());
