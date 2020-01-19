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
const Driver = require('../app/models/drivers')

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

    for (const d of drivers) {
        const newDriver = new Driver(d)
        await newDriver.save()
    }
})


// PARKING ENDPOINTS

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
                latitude:  43.139370,
                longitude: 13.068363,
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

// COMPANIES ENDPOINTS

/**
 * Testing get companies endpoint for all companies
 */
describe('Get /COMPANIES', () => {
    it('should return all companies ', async done => {
        const res = await request.get('/api/companies')
        expect(res.status).toBe(200)
        expect(res.body.status).toBe("success")
        expect(res.body).toHaveProperty('content')
        done()
    });
});


/**
 * Testing get companies endpoint for specific company
 */
describe('Get /COMPANIES', () => {
    it('should return the requested company', async done => {
        const res = await request.get('/api/companies/Company1')
        expect(res.status).toBe(200)
        expect(res.body.status).toBe("success")
        expect(res.body).toHaveProperty('content')
        done()
    });
});

/**
 * Testing get companies endpoint for non-existent company
 */
describe('Get /COMPANIES', () => {
    it('should return 404 status code', async done => {
        const res = await request.get('/api/companies/CompanyOmega')
        expect(res.status).toBe(404)
        done()
    });
});

/**
 * Testing post company endpoint to register a new company
 */
describe('Post /COMPANIES', () => {
    it('should add a new company', async done => {
        const res = await request.post('/api/companies')
            .set('Authorization', 'Bearer ' + token)
            .type('form')
            .send({
                name: 'CompagniaAlfa',
                email: 'alfa@companyalfa.it',
                telephone: 3338656789,
                street: 'via 1 Marzo 34',
                city: 'Camerino',
                postalCode: 12345,
                partitaIVA: '567534'
            })
        expect(res.status).toBe(201)
        expect(res.body.status).toBe("success")
        expect(res.body).toHaveProperty('content')
        done()
    });
});

/**
 * Testing post company endpoint to register already existing company
  */
describe('Post /COMPANIES', () => {
    it('should return existingCompanyError', async done => {
        const res = await request.post('/api/companies')
            .set('Authorization', 'Bearer ' + token)
            .type('form')
            .send({
                name: 'Company1',
                email: 'company1@company1.it',
                telephone: 366123456,
                partitaIVA: '123456',
                street: 'Via Buozzi 3',
                city: 'Genova',
                postalCode: 12452,
            })
        expect(res.status).toBe(422)
        expect(res.body.message).toBe("existingCompanyError")
        done()
    });
});


/**
 * Testing delete company endpoint
 */

describe('Delete /COMPANIES', () => {
    it('should delete Company2', async done => {
        const res = await request.delete('/api/companies/Company2')
            .set('Authorization', 'Bearer ' + token)
        expect(res.status).toBe(204)
        done()
    })
})

/**
 * Testing delete on not-existing company endpoint
 */
describe('Delete /COMPANIES', () => {
    it('should return 404 status code', async done => {
        const res = await request.delete('/api/companies/CompanyBeta')
            .set('Authorization', 'Bearer ' + token)
        expect(res.status).toBe(404)
        done()
    })
})


//DRIVER ENDPOINTS

/**
 * Testing post endpoint for driver login
 */

describe('Post /DRIVER', () => {
    it('should return 200 and user data', async done => {
        const res = await request.post('/api/driver-login')
            .type('form')
            .send({
                phone: "3339393399",
                password: "pass"
            })
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('content')
        done()
    })
})


/**
 * Testing post endpoint for driver login with wrong credentials
 */
describe('Post /DRIVER', () => {
    it('should return 404', async done => {
        const res = await request.post('/api/driver-login')
            .set('Authorization', 'Bearer ' + token)
            .type('form')
            .send({
                phone: "3337773456",
                password: "password"
            })
        expect(res.status).toBe(404)
        done()
    })
})

/**
 * Testing post to register driver
 */
describe('Post /DRIVER', () => {
    it('should create a new driver', async done => {
        const res = await request.post('/api/driver')
            .type('form')
            .send({
                name: "Morena",
                surname: "Barboni",
                email: "morena@gmail.com",
                password: "password",
                phone: "333888456",
            })
        expect(res.status).toBe(200)
        done()
    })
})

/**
 * Testing post to register already existing driver
 */
describe('Post /DRIVER', () => {
    it('should return 422 status code ', async done => {
        const res = await request.post('/api/driver')
            .type('form')
            .send({
                name: "Lorenzo",
                surname: "Matteucci",
                email: "lorenzo@gmail.com",
                password: "password",
                phone: "3339393399",
            })
        expect(res.status).toBe(422)
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
    {
        name: 'Company2',
        email: 'company2@company2.it',
        telephone: 366905463,
        partitaIVA: '202020',
        address: {
            street: 'Via Marchetti 31',
            city: 'Roma',
            postalCode: 14567,
        }
    },
    {
        name: 'Company1',
        email: 'company1@company1.it',
        telephone: 366123456,
        partitaIVA: '123456',
        address: {
            street: 'Via Buozzi 3',
            city: 'Genova',
            postalCode: 12452
        }
    }
]

const parkings = [
    {
        id: 1,
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
        location: {
            type: "Point",
            coordinates: [
                13.066542,
                43.144359]
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
        location: {
            type: "Point",
            coordinates: [
                13.068391,
                43.139420]
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

const drivers = [
    {
        email: "lorenzo@gmail.com",
        name: "Lorenzo",
        surname: "Matteucci",
        password: "pass",
        phone: "3339393399",
        address: {},
    }
]