var http = require('http');
var app = require('./app');
var config = require('./config').config;

http.createServer(app).listen(config.server.port);
