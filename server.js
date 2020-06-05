// config file
require('./config.js');
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

// Start server
var server = app.listen(8080);
console.log("App listening on port 8080");

// MySQL DB
//var db = require('./db');

require('./html');

// Communication FrontFrontend & FrontBackend
global.io = require('socket.io')(server);
global.io.on('connection', function() {
    console.log("new User");
    //global.io.emit("buttonStates", global.pump1);
});
