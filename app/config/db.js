//Mongoose configuration
var mongoose = require('mongoose');

//Schemas
require('../models/users');
require('../models/companies');
require('../models/parkings');
require('../models/drivers');
require('../models/stops');
require('../models/bookings');
require('../models/notices');


//Connection string

const Atlas_Uri = "mongodb+srv://morena:" + process.env.Atlas_Pass + "@cluster0-eshef.gcp.mongodb.net/test?retryWrites=true&w=majority";
const local_Url = 'mongodb://localhost/pickapark';

// Connect to Mongoose and set connection variable
mongoose.connect(Atlas_Uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  .then(() => console.log('connected to Mongo DB'))
  .catch(err => {
    console.log('Mongoose error:' + err);
  });

