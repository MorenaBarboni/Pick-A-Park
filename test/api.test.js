//Use test server and test DB environments
const app = require('./testServer');
app.listen(8080);

//Import supertest for http requests
const supertest = require('supertest');
const request = supertest(app);
jest.setTimeout(30000); //Set test timeout

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


/**
 * Testing get parkings endpoint
 */
describe('Get /PARKINGS', () => {
    it('should return parkings of Company 1', async done => {
        const res = await request.get('/api/companies/Company1/parkings').set('Authorization', 'Bearer ' + token)
        expect(res.status).toBe(200)
        expect(res.body.status).toBe("success")
        expect(res.body).toHaveProperty('content')
        done()
    })
})

/**
 * Testing get parkings endpoint for non-existent company
 */
describe('Get /PARKINGS', () => {
    it('should return 404 status code', async done => {
        const res = await request.get('/api/companies/Company10/parkings').set('Authorization', 'Bearer ' + token)
        expect(res.status).toBe(404)
        done()
    })
})



/**
 * Testing post parking endpoint
 */
describe('Post /PARKINGS', () => {
    it('should create a new parking', async done => {
        const res = await request.post('/api/companies/Company1/parkings')
            .set('Authorization', 'Bearer ' + token)
            .send({
                id: 18,
                city: "Camerino",
                address: "Madonna delle Carceri",
                latitude: 43.99088,
                longitude: 13.29177,
                indoor: false,
                handicap: false,
                price: 2.0
            })
        expect(res.status).toBe(201)
        expect(res.body.status).toBe("success")
        expect(res.body).toHaveProperty('content')
        done()
    })
})

/**
 * Testing post parking endpoint for existing parking ID
 */
describe('Post /PARKINGS', () => {
    it('should return existing parking error', async done => {
        const res = await request.post('/api/companies/Company1/parkings')
            .set('Authorization', 'Bearer ' + token)
            .type('form')
            .send({
                id: 1,
                city: "Camerino",
                address: "Madonna delle Carceri",
                latitude: 43.77,
                longitude: 13.77,
                indoor: false,
                handicap: false,
                price: 2.0
            })
        expect(res.status).toBe(422)
        expect(res.body.message).toBe("existingParkingError")
        done()
    })
})

/**
 * Testing post parking endpoint for existing parking coordinates
 */
describe('Post /PARKINGS', () => {
    it('should return existing coordinates error', async done => {
        const res = await request.post('/api/companies/Company1/parkings')
            .set('Authorization', 'Bearer ' + token)
            .type('form')
            .send({
                id: 77,
                city: "Camerino",
                address: "Madonna delle Carceri",
                latitude: 43.139802,
                longitude: 13.069174,
                indoor: false,
                handicap: false,
                price: 2.0
            })
        expect(res.status).toBe(422)
        expect(res.body.message).toBe("existingCoordError")
        done()
    })
})



/**
 * Testing delete parking endpoint
 */
describe('Delete /PARKINGS', () => {
    it('delete a parking request', async done => {
        const res = await request.delete('/api/companies/Company1/parkings/3')
            .set('Authorization', 'Bearer ' + token)
        expect(res.status).toBe(204)
        done()
    })
})


/**
 * Testing delete parking endpoint for non-existent parking
 */
describe('Delete /PARKINGS', () => {
    it('should return 404', async done => {
        const res = await request.delete('/api/companies/Company1/parkings/999')
            .set('Authorization', 'Bearer ' + token)
        expect(res.status).toBe(404)
        done()
    })
})



/**
 * Testing patch parking endpoint
 */
describe('Patch /PARKINGS', () => {
    it('should patch a parking', async done => {
        const res = await request.patch('/api/companies/Company1/parkings/2')
            .set('Authorization', 'Bearer ' + token)
            .type('form')
            .send({
                price: 2.7
            })
        expect(res.status).toBe(200)
        expect(res.body.status).toBe("success")
        expect(res.body).toHaveProperty('content')
        done()
    })
})

/**
 * Testing patch parking endpoint for non-existent parking
 */
describe('Patch /PARKINGS', () => {
    it('should return 404', async done => {
        const res = await request.patch('/api/companies/Company1/parkings/999')
            .set('Authorization', 'Bearer ' + token)
            .type('form')
            .send({
                price: 2.7
            })
        expect(res.status).toBe(404)
        done()
    })
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