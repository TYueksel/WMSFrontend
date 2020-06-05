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
	global.mqttUSER = '';
	global.mqttPW = '';
	global.mqttHOST = '';
	global.mqttPORT = '';
	global.VIN = '';
	global.mqttTOPIC = '';

}());
