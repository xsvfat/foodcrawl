var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var session = require('express-session');
var handlers = require('./handlers.js');

// open connection to MongoDB database
mongoose.connect('mongodb://localhost/foodfood');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'FOOD', resave: true, saveUninitialized: true }))

// serves initial static index file
app.use('/', express.static(path.join(__dirname, '../client')));

// We won't have access to node_modules because we are in the client dir
app.use('/lib', express.static(path.join(__dirname, '../../node_modules')));

// handles 'start' & 'end' POST request
app.post('/maps/submit', handlers.submit);

app.post('/login', handlers.login);
app.post('/signup', handlers.signup);
app.post('/options', handlers.saveOptions);

app.listen(8000);
console.log('Now listening on 127.0.0.1:8000')
