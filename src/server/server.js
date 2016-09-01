var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var handlers = require('./handlers.js');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

// serves initial static index file
app.use('/', express.static(path.join(__dirname, '../client')));

// We won't have access to node_modules because we are in the client dir
app.use('/lib', express.static(path.join(__dirname, '../../node_modules')));

// handles 'start' & 'end' POST request
app.post('/maps/submit', handlers.submit);

app.listen(8000);
console.log('Now listening on 127.0.0.1:8000')
