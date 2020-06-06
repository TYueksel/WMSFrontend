(function() {

	global.pump1 = false;
	global.pump2 = false;
	global.valve1 = false;
	global.valve2 = false;

	/**
	 * Config für lokale MySQL Datenbank auf dem PI
	 */
	global.sqlHOST = 'localhost';
	global.sqlDB = 'WMS';
	global.sqlUSER = 'admin';
	global.sqlPW = 'admin';

	/**
	 * MQTT Zugangsdaten
	 */
	global.mqttUSER = 'tolunay.yueksel@gmail.com';
	global.mqttPW = '437c0228';
	global.mqttHOST = 'mqtt://mqtt.dioty.co:1883';
	global.mqttTOPIC = '/tolunay.yueksel@gmail.com/';

}());
