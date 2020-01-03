//Test db configuration

//Mongoose configuration
var mongoose = require('mongoose');

//Schemas
require('../models/users');
require('../models/companies');
require('../models/parkings');

//Test DB Connection string
const Atlas_Uri = "mongodb+srv://morena:" + process.env.Atlas_Pass + "@cluster0-eshef.gcp.mongodb.net/testing?retryWrites=true&w=majority";

// Connect to Mongoose and set connection variable
mongoose.connect(Atlas_Uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
  .then(() => console.log('Mongoose Connected'))
  .catch(err => {
    console.log('Mongoose error:' + err);
  });

