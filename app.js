var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var data = require('./movies.js');

app.use('/movies',data);

app.listen(8080);
