(function() {
 
	'use strict';
	var express = require('express');
	var router = express.Router();
	const mqtt = require('./mqtt');
	var db = require('./db');
	
	router.get('/api/data', function(req, res) {
		const message = {
			tank1: global.tank1,
			tank2: global.tank2,
			turbidity: global.turbidity,
			pump1: global.pump1,
			valve1: global.admin.valve1,
			valve2: global.admin.valve2,
			used1: global.user1.used,
			used2: global.user2.used,
			limit1: global.user1.limit,
			limit2: global.user2.limit,
			using1: global.user1.using,
			using2: global.user2.using
		};
		res.send(message);
	});
	
	router.get('/api/pump1/:state', function(req, res) {
		global.pump1 = (req.params.state.substring(1) == 'true');
		if(global.pump1) {
			global.logger.log("Turning Pump 1 ON");
			mqtt.sendMsg("Pump1", "on");
		} else {
			global.logger.log("Turning Pump 1 OFF");
			mqtt.sendMsg("Pump1", "off");
		}
		res.send('ok');
	});
	
	router.get('/api/admin/valve1/:state', function(req, res) {
		global.admin.valve1 = (req.params.state.substring(1) == 'true');
		global.valve1 = global.admin.valve1 && global.user1.using;
		if(global.valve1) {
			global.logger.log("Valve 1 turned ON");
			mqtt.sendMsg("Valve1", "on");
		} else {
			global.logger.log("Valve 1 turned OFF");
			mqtt.sendMsg("Valve1", "off");
		}
		res.send('ok');
	});
	
	router.get('/api/admin/valve2/:state', function(req, res) {
		global.admin.valve2 = (req.params.state.substring(1) == 'true');
		global.valve2 = global.admin.valve2 && global.user2.using;
		if(global.valve2) {
			global.logger.log("Valve 2 turned ON");
			mqtt.sendMsg("Valve2", "on");
		} else {
			global.logger.log("Valve 2 turned OFF");
			mqtt.sendMsg("Valve2", "off");
		}
		res.send('ok');
	});
	
	router.get('/api/user/valve1/:state', function(req, res) {
		global.user1.using = (req.params.state.substring(1) == 'true');
		global.valve1 = global.admin.valve1 && global.user1.using;
		if(global.valve1) {
			global.logger.log("Valve 1 turned ON");
			mqtt.sendMsg("Valve1", "on");
		} else {
			global.logger.log("Valve 1 turned OFF");
			mqtt.sendMsg("Valve1", "off");
		}
		res.send('ok');
	});
	
	router.get('/api/user/valve2/:state', function(req, res) {
		global.user2.using = (req.params.state.substring(1) == 'true');
		global.valve2 = global.admin.valve2 && global.user2.using;
		if(global.valve2) {
			global.logger.log("Valve 2 turned ON");
			mqtt.sendMsg("Valve2", "on");
		} else {
			global.logger.log("Valve 2 turned OFF");
			mqtt.sendMsg("Valve2", "off");
		}
		res.send('ok');
	});
	
	router.get('/api/limit1/:limit', function(req, res) {
		const newLimit = req.params.limit.substring(1);
		global.logger.log("User 1 Limit: " + newLimit);
		mqtt.sendMsg("Limit1", newLimit);
		global.valve1 = global.admin.valve1 && global.user1.using;
		
		if(newLimit > global.user1.limit && global.valve1) {
			setTimeout(function() {
				global.logger.log("User 1 Limit raised: Turning Valve1 ON");
				mqtt.sendMsg("Valve1", "on");
			}, 1000);
		}
		
		global.user1.limit = newLimit;
		db.updateLimits();
		
		global.io.emit("reloadUser");
		
		res.send('ok');
	});
	
	router.get('/api/limit2/:limit', function(req, res) {
		const newLimit = req.params.limit.substring(1);
		global.logger.log("User 2 Limit: " + newLimit);
		mqtt.sendMsg("Limit2", newLimit);
		global.valve2 = global.admin.valve2 && global.user2.using;
		
		if(newLimit > global.user2.limit && global.valve2) {
			setTimeout(function() {
				global.logger.log("User 2 Limit raised: Turning Valve2 ON");
				mqtt.sendMsg("Valve2", "on");
			}, 1000);
		}
		
		global.user2.limit = newLimit;
		db.updateLimits();
		
		
		global.io.emit("reloadUser");
		
		res.send('ok');
	});
	
	router.get('/api/reset', function(req, res) {
		global.admin = {
			valve1: false,
			valve2: false
		}
		global.user1 = {
			used: 0,
			limit: 0,
			using: false
		};
		global.user2 = {
			used: 0,
			limit: 0,
			using: false
		};
		global.pump1 = false;
		global.valve1 = false;
		global.valve2 = false;
		
		db.resetDB();
		
		mqtt.sendMsg("Reset", "");
		
		global.io.emit("reloadPage");
		global.io.emit("reloadUsers");
		
		res.send('ok');
	});

	module.exports = router;
 
}());
