//Dotenv
require('dotenv').config()

//Initialize db with data
var parkings = require('./app/models/parkings');
var companies = require('./app/models/companies');

var mongoose = require('mongoose');

const Atlas_Uri = "mongodb+srv://morena:" + process.env.Atlas_Pass + "@cluster0-eshef.gcp.mongodb.net/test?retryWrites=true&w=majority";
const local_Url = 'mongodb://localhost/pickapark';

// Connect to Mongoose and set connection variable
mongoose.connect(Atlas_Uri, { useNewUrlParser: true }, {
  useMongoClient: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Failed connection to DB'));

//Saves document in db. If the object already exixst, it updates it.
parkings.updateOne(
    { id: 1 },
    {
        $set: {
            city: "Camerino",
            address: "Madonna delle Carceri",
            coordinates: {
                latitude: 43.139802,
                longitude: 13.069174
            },
            company: "Company1",
            plate: null,
            isFree: true,
            handicap: false,
            indoor: false,
            price: 2.0,
            isApproved: false,
            isUsable: true
        }
    },
    { upsert: true },
    function (err) {
        if (err) {
            console.log(err);
        }
    }
);


parkings.updateOne(
    { id: 2 },
    {
        $set: {
            city: "Camerino",
            address: "Madonna delle Carceri",
            coordinates: {
                latitude: 43.139370,
                longitude: 13.068363
            },
            company: "Company2",
            plate: null,
            isFree: true,
            handicap: false,
            indoor: false,
            price: 2.0,
            isApproved: false,
            isUsable: true
        }
    },
    { upsert: true },
    function (err) {
        if (err) {
            console.log(err);
        }
    }
);

parkings.updateOne(
    { id: 3 },
    {
        $set: {
            city: "Camerino",
            address: "Madonna delle Carceri",
            coordinates: {
                latitude: 43.139285,
                longitude: 43.139285
            },
            company: "Company1",
            plate: null,
            isFree: true,
            handicap: false,
            indoor: false,
            price: 3.0,
            isApproved: false,
            isUsable: true
        }
    },
    { upsert: true },
    function (err) {
        if (err) {
            console.log(err);
        }
    }
);

companies.updateOne(
    { name: "Company1" },
    {
        $set: {
            name: "Company1"
        }
    },
    { upsert: true },
    function (err) {
        if (err) {
            console.log(err);
        }
    }
);


companies.updateOne(
    { name: "Company2" },
    {
        $set: {
            name: "Company2"
        }
    },
    { upsert: true },
    function (err) {
        if (err) {
            console.log(err);
        }
    }
); 