//Mongoose configuration

var mongoose = require('mongoose');
//Connection string
var url = 'mongodb://localhost/pickapark';

//Schemas
require('../models/users');
require('../models/companies');
require('../models/parkings');

// Connect to Mongoose and set connection variable
mongoose.connect(url, { useNewUrlParser: true });

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + url);
});
mongoose.connection.on('error', function (err) {
  console.log('Mongoose error: ' + err);
});



