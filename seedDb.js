//Dotenv
require('dotenv').config()

//Initialize db with data
var parkings = require('./app/models/parkings');
var companies = require('./app/models/companies');
var drivers = require('./app/models/drivers');

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

/* PARKINGS */

//Company 1 Parkings
parkings.updateOne(
    { id: 1 },
    {
        $set: {
            city: "Camerino",
            address: "Madonna delle Carceri",
            location: {
                type: "Point",
                coordinates: [
                    13.069174,
                    43.139802]
            },
            company: "Company1",
            plate: null,
            handicap: false,
            indoor: false,
            price: 2.0,
            isApproved: true,
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
            location: {
                type: "Point",
                coordinates: [
                    13.068363,
                    43.139370]
            },
            company: "Company1",
            plate: null,
            handicap: false,
            indoor: false,
            price: 2.0,
            isApproved: true,
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
            location: {
                type: "Point",
                coordinates: [
                    13.066542,
                    43.144359]
            },
            company: "Company1",
            plate: null,
            handicap: false,
            indoor: false,
            price: 3.0,
            isApproved: true,
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

//Company 2 Parkings
parkings.updateOne(
    { id: 4 },
    {
        $set: {
            city: "Camerino",
            address: "Madonna delle Carceri",
            coordinates: {
                latitude: 43.144370,
                longitude: 13.448363
            },
            location: {
                type: "Point",
                coordinates: [
                    13.068391,
                    43.139420]
            },
            company: "Company2",
            plate: null,          
            handicap: false,
            indoor: false,
            price: 2.0,
            isApproved: true,
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

/* COMPANIES */

companies.updateOne(
    { name: "Company1" },
    {
        $set: {
            name: "Company1",
            telephone: "3934677657",
            email: "company1@gmail.com",
            address: {
                street: "Via Aldo Moro 11",
                city: "Camerino",
                postalCode: "62032"
            },
            partitaIVA: "02011346424"
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
            name: "Company2",
            telephone: "3935577657",
            email: "company2@gmail.com",
            address: {
                street: "Via Aldo Moro 12",
                city: "Camerino",
                postalCode: "62032"
            },
            partitaIVA: "99913090424"
        }
    },
    { upsert: true },
    function (err) {
        if (err) {
            console.log(err);
        }
    }
);

/* DRIVERS */
drivers.updateOne(
    { email: "lorenzo@gmail.com" },
    {
        $set: {
            name: "Lorenzo",
            surname: "Matteucci",
            password: "pass",
            phone: "3339393399",
            address: {
                latitude: 43.139285,
                longitude: 43.139285
            }
        }
    },
    { upsert: true },
    function (err) {
        if (err) {
            console.log(err);
        }
    }
);
