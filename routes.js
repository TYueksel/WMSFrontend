(function() {
 
	'use strict';
	var express = require('express');
	var router = express.Router();
	//var db = require('./db');
	
	router.get('/api/data', function(req, res) {
		const message = {
			text: "test",
			pump1: global.pump1
		};
		res.send(message);
	});
	
	/*router.get('/test', function(req, res) {
		var HTMLParser = require('node-html-parser');
		var fs = require('fs');
		
		fs.readFile(__dirname + '/public/index.html', 'utf8', function (err,data) {
	  		if (err) {
				return console.log(err);
	  		}
	  		
	  		var root = HTMLParser.parse(data);
	  		if(global.pump1) {
				root.querySelector('#pump1ON').setAttribute("disabled", null);
	  			root.querySelector('#pump1OFF').removeAttribute("disabled");
			} else {
				root.querySelector('#pump1ON').removeAttribute("disabled");
	  			root.querySelector('#pump1OFF').setAttribute("disabled", null);
			}
	  		
	  		res.send(root.toString());
		});
	});*/
	
	router.get('/api/pump1/:state', function(req, res) {
		global.pump1 = (req.params.state.substring(1) == 'true');
		if(global.pump1) {
			console.log("Pump 1 turned ON");
		} else {
			console.log("Pump 1 turned OFF");
		}
		res.send('ok');
	});

	module.exports = router;
 
}());
