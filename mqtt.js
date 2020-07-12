(function() {
	'use strict';

	const mqtt = require('mqtt');
	const db = require('./db');
	
	// Create a client connection
    var client = mqtt.connect(global.mqttHOST, {
    	username: global.mqttUSER,
    	password: global.mqttPW
    });

    client.on('connect', function() { // Check you have a connection
		global.logger.log("Connected to MQTT Broker");
		
    	// Subscribe to a Topic
    	client.subscribe(global.mqttTOPIC + "Backend", function() {
    		// When a message arrives
            handleMessages();
            
            sendMsg("Hello", "");
        });

    });
    
    function handleMessages() {
    	client.on('message', function(topic, message) {
			try {
				message = toJSON(message);
			} catch(e) {
				console.error(e);
			}
			
			//console.log("Received '" + message.data + "' on '" + message.subtopic + "'");
			
			if(message.subtopic == "Hello") {
				const msg = {
					usage1: global.user1.used,
					usage2: global.user2.used,
					limit1: global.user1.limit,
					limit2: global.user2.limit,
					valve1: global.admin.valve1 && global.user1.using,
					valve2: global.admin.valve2 && global.user2.using
				};
				sendMsg("Info", msg);
			} else if(message.subtopic == "Info") {
				global.tank1 = message.data.tank1;
				global.tank2 = message.data.tank2;
				global.user1.used = message.data.usage1;
				global.user2.used = message.data.usage2;
				global.turbidity = message.data.turbidity;
				if(message.data.pump1 == "on") {
					global.pump1 = true;
				} else if(message.data.pump1 == "off") {
					global.pump1 = false;
				}
				if(message.data.valve1 == "on") {
					global.valve1 = true;
				} else if(message.data.valve1 == "off") {
					global.valve1 = false;
				}
				if(message.data.valve2 == "on") {
					global.valve2 = true;
				} else if(message.data.valve2 == "off") {
					global.valve2 = false;
				}
				
				db.updateUsage();
				db.updateLimits();
				
				global.io.emit("reloadPage");
				global.io.emit("reloadUsers");
			} else if(message.subtopic == "Tank1") {
				global.tank1 = message.data;
				global.logger.log("Tank1 is: " + global.tank1);
				global.io.emit("reloadPage");
			} else if(message.subtopic == "Tank2") {
				global.tank2 = message.data;
				global.logger.log("Tank2 is: " + global.tank2);
				global.io.emit("reloadPage");
			} else if(message.subtopic == "Usage") {
				console.log("Received Usage1: " + message.data[0]);
				console.log("Received Usage2: " + message.data[1]);
				if(message.data[0] > global.user1.used) global.user1.used = message.data[0];
				if(message.data[1] > global.user2.used) global.user2.used = message.data[1];
				
				db.updateUsage();
				
				global.io.emit("reloadUsers");
			} else if(message.subtopic == "Turbidity") {
				global.turbidity = message.data;
			} else if(message.subtopic == "Pump1") {
				global.pump1 = message.data;
				global.io.emit("reloadPage");
			} else if(message.subtopic == "Valve1") {
				global.valve1 = message.data;
				global.io.emit("reloadPage");
			} else if(message.subtopic == "Valve2") {
				global.valve2 = message.data;
				global.io.emit("reloadPage");
			}
		});
    }
    
    exports.closeMQTT = function() {
    	client.end();
    };

	function sendMsg(subtopic, message) {
		const data = {subtopic: subtopic, data: message};
		const buf = toBuffer(data);
		client.publish(global.mqttTOPIC + "Frontend", buf, {qos: 2});
	};

	exports.sendMsg = sendMsg;
	
	function toBuffer(data) {
		return Buffer.from(JSON.stringify(data));
	}
	
	function toJSON(data) {
		return JSON.parse(data.toString());
	}

}());
