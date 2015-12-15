var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var compress = require('compression');

var api = require('./index').router;

app.use(compress());
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', api);

module.exports = app;
