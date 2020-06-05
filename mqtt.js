(function() {
	'use strict';


	var mqtt = require('mqtt');
	var db = require('./db');
	
	var topic = global.mqttTOPIC;
	var clientId = 'mqtt_' + global.VIN;
	var client  = mqtt.connect({username: global.mqttUSER, password: global.mqttPW, port: global.mqttPORT, host: global.mqttHOST, clientId: clientId});


	/**
	 * Warte auf Verbindung zu MQTT Broker
	 */
	client.on('connect', function () {
		console.log("MQtt connected");
		// MQTT Topic abonnieren
		client.subscribe(topic);
		// Online Benachrichtigung schicken
                db.getLastTripID(function(lastID) {
                        var buf = toBuffer({subtopic: 'online', data: lastID});
                        client.publish(topic, buf, {qos: 2});
                });
	});
        
        client.on('offline', function () {
		console.log("Couldn't connect or lost connection to MQTT Broker");
	});
        
	/**
	 *  Warte auf neue MQTT Nachricht
	 */
	client.on('message', function(topic, message) {
		try {
			message = toJSON(message);
		} catch(e) {
			console.log(e);
		}
		/**
		 * Neue User Daten empfangen
		 */
		if(message.subtopic === "Users") {
			db.updateUser( message.data );
		}
		/**
		 * Serveranwendung meldet nicht vorhandenen(e) GPS Punkt(e)
		 */
		if(message.subtopic === "MissingGPS") {
			// Punkt(e) in Datenbank suchen
			db.getGPSInList( message.data, function(gps) {
				// Gefundene GPS Punkte einzeln schicken
				for (var i = 0; i < gps.length; i++) {
					var data = {
						lat: gps[i].lat,
						lng: gps[i].lng,
						id: gps[i].id,
						trip_id: gps[i].trip_id
					};
					exports.publishGPS(data);
				}
			});
		}
		/**
		 * Serveranwendung fragt nach Trip Data
		 * wird aktuell nicht verwendet
		 */
		if(message.subtopic === "TripData") {
			db.getTripShort(message.data.id, function(data) {
				exports.publishTrip(data);
			});
		}
                
                if(message.subtopic === "Request Trips") {
                        let tripdata;
                        db.getMissingTripData(message.data).then(function(trips) {
                                tripdata = trips;
                                return db.getGPSOfTrip(message.data);
                        }).then(function(gps) {
                                let buf = toBuffer({subtopic: 'Missing Trip Data', data: {tripdata, gps}});
                                client.publish(topic, buf, {qos: 2});
                        });
		}
                
                if(message.subtopic === "Incomplete Trips") {
                        db.getGPSCountOfTrip(message.data, function(counts) {
                                let buf = toBuffer({subtopic: 'Counts', data: counts});
                                client.publish(topic, buf, {qos: 2});
                                console.log("Counts sent");
                        });
		}
                
                if(message.subtopic === "Request GPS") {
                        db.getGPSOfTrip(message.data).then(function(gps) {
                                let buf = toBuffer({subtopic: 'Missing GPS', data: gps});
                                client.publish(topic, buf, {qos: 2});
                                console.log("Missing GPS sent")
                        });
                }
                
	});

	/**
	 * Veröffentlicht die Trip Daten über MQTT
	 */ 
	exports.publishTrip = function(data) {
		data = {subtopic: 'updateTrip', data: data};
		var buf = toBuffer(data);
		client.publish(topic, buf, {qos: 2});
	};
        
	/**
	 * Veröffentlicht die Daten der drei letzten Trips
	 */
	exports.publishLast3Trips = function() {
	 	db.getTripShortLimit(3, function(data) {
	 		for(var i=0; i<data.length; i++) {
	 			exports.publishTrip(data[i]);
	 		}
	 	});
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

	/**
	 * Konvertiert JSON Array zu ByteBuffer
	 */
	function toBuffer(data) {
		return Buffer.from(JSON.stringify(data));
	}
	/**
	 * Konvertiert ByteBuffer zu JSON Array
	 */
	function toJSON(data) {
		return JSON.parse(data.toString());
	}

}());