// config file
require('./config');
// Init logger
global.logger = require('./logger');
// Back-End web framework
var express  = require('express');
// Filesystem: https://nodejs.org/api/path.html
var path = require('path');
// Parse incoming request bodies in a middleware before your handlers
var bodyParser = require('body-parser');
// Einbinden der Routings
var routes = require('./routes');

// Init Express App
var app = express();

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

app.use(express.static(path.join(__dirname, './public')));

// Routes benutzen
app.use('/', routes);

var mqtt;

// MySQL DB
const db = require('./db');
db.getData(function(res) {
	// Start server
	var server = app.listen(8080);
	global.logger.log("App listening on port 8080");
	
	mqtt = require('./mqtt');
	
	// Communication FrontFrontend & FrontBackend
	global.io = require('socket.io')(server);
});

process.on('SIGINT', function() {
	global.logger.log("Terminating...");
	db.endConnection();
	mqtt.closeMQTT();
	global.logger.close();
	process.exit();
});
