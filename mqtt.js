(function() {
	'use strict';


	var mqtt = require('mqtt');
	
	// Create a client connection
    var client = mqtt.connect(global.mqttHOST, {
    username: global.mqttUSER,
    password: global.mqttPW
    });

    client.on('connect', function() { // Check you have a connection
		console.log("Connect to MQTT Broker");
		
    	// Subscribe to a Topic
    	client.subscribe(global.mqttTOPIC, function() {
    		// When a message arrives, write it to the console
            client.on('message', function(topic, message) {
                console.log("Received '" + message + "' on '" + topic + "'");
            });
        });

    });
    
    exports.closeMQTT = function() {
    	client.end();
    };

	/**
	 *  Veröffentlicht GPS Koordinaten über MQTT
	 */
	exports.publishGPS = function(data) {
		data = {subtopic: 'GPS', data: data};
		//console.log(data);
		var buf = toBuffer(data);
		client.publish(topic, buf, {qos: 2});
	};

}());
