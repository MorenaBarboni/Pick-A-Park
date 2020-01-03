
//Import supertest for http requests
const supertest = require('supertest');
const request = supertest(app);
jest.setTimeout(30000); //Set test timeout

//Use test server and test DB environments
const app = require('./testServer');
app.listen(8080);

const token = process.env.token; //JWT

const mongoose = require('mongoose');
const Company = require('../app/models/companies')
const Parking = require('../app/models/parkings')


//Before testing removes all entries from db and seeds db with test data
beforeAll(async () => {
    const collections = Object.keys(mongoose.connection.collections)
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName]
        await collection.deleteMany()
    }
    for (const c of companies) {
        const newCompany = new Company(c)
        await newCompany.save()
    }
    for (const p of parkings) {
        const newParking = new Parking(p)
        await newParking.save()
    }
})


afterAll(async () => {
    // Closes the Mongoose connection
    await mongoose.connection.close()
    console.log("Mongoose State:" + mongoose.connection.readyState);
})


//Seed test db data
const companies = [
    { name: 'Company1' },
    { name: 'Company2' }
]

const parkings = [
    {
        id: 1,
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
    },
    {
        id: 2,
        city: "Camerino",
        address: "Madonna delle Carceri",
        coordinates: {
            latitude: 43.139370,
            longitude: 13.068363
        },
        company: "Company1",
        plate: null,
        isFree: true,
        handicap: false,
        indoor: false,
        price: 2.0,
        isApproved: false,
        isUsable: true
    },
    {
        id: 3,
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
]