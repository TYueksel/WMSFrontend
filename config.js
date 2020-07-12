(function() {

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

	global.tank1 = null;
	global.tank2 = null;
	global.turbidity = null;
	global.pump1 = false;
	global.valve1 = global.admin.valve1 && global.user1.using;
	global.valve2 = global.admin.valve2 && global.user2.using;

	/**
	 * Config for local MySQL DB
	 */
	global.sqlHOST = 'localhost';
	global.sqlDB = 'WMS';
	global.sqlUSER = 'pi';
	global.sqlPW = 'group24';

	/**
	 * Config for MQTT
	 */
	global.mqttUSER = 'tolunay.yueksel@gmail.com';
	global.mqttPW = '437c0228';
	global.mqttHOST = 'mqtt://mqtt.dioty.co:1883';
	global.mqttTOPIC = '/tolunay.yueksel@gmail.com/';

}());
