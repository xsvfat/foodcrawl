var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

app.use('/', express.static(path.join(__dirname, '../client')));
// We won't have access to node_modules because we are in the client dir
app.use('/lib', express.static(path.join(__dirname, '../../node_modules')));


app.listen(8000);
console.log('Now listening on 127.0.0.1:8000')
