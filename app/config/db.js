//Mongoose configuration
var mongoose = require('mongoose');


//Schemas
require('../models/users');
require('../models/companies');
require('../models/parkings');

//Connection string

const Atlas_Uri = "mongodb+srv://morena:" + process.env.Atlas_Pass + "@cluster0-eshef.gcp.mongodb.net/test?retryWrites=true&w=majority";
const local_Url = 'mongodb://localhost/pickapark';

// Connect to Mongoose and set connection variable
mongoose.connect(Atlas_Uri, { useNewUrlParser: true }, {
  useMongoClient: true
});

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + Atlas_Uri);
});
mongoose.connection.on('error', function (err) {
  console.log('Mongoose error: ' + err);
});



