//Use test server and test DB environments
const app = require('./testServer');
app.listen(8080);

//Import supertest for http requests
const supertest = require('supertest');
const request = supertest(app);
jest.setTimeout(30000); //Set test timeout

const token = process.env.token; //JWT

const mongoose = require('mongoose');
var moment = require("moment");
const Company = require('../app/models/companies');
const Parking = require('../app/models/parkings');
const Driver = require('../app/models/drivers');
const Booking = require('../app/models/bookings');
const Stop = require('../app/models/stops');


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
    for (const b of bookings) {
        const newBooking = new Booking(b)
        await newBooking.save()
    }
    for (const s of stops) {
        const newStop = new Stop(s)
        await newStop.save()
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
                latitude: 43.139370,
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

// PARKING DESTINATION ENDPOINT

/**
 * Testing get destination endpoint
 */
describe('Get /DESTINATIONS', () => {
    it('should return closest available parking to coordinates ', async done => {
        const res = await request.get('/api/destination/43.145164/13.070039')
        expect(res.status).toBe(200)
        expect(res.body.status).toBe("success")
        expect(res.body).toHaveProperty('content')
        expect(res.body.content).toHaveProperty('distance')
        done()
    })
})

/**
 * Testing get destination endpoint for custom max distance
 */
describe('Get /DESTINATIONS', () => {
    it('should return closest available parking to coordinates (for max 200 m) ', async done => {
        const res = await request.get('/api/destination/43.145164/13.070039?maxDistance=200')
        expect(res.status).toBe(200)
        expect(res.body.status).toBe("success")
        expect(res.body).toHaveProperty('content')
        expect(res.body.content).toHaveProperty('distance')
        done()
    })
})

/**
 * Testing get destination endpoint for unavailable parking
 * (destination is too far from closest parking)
 */
describe('Get /DESTINATIONS', () => {
    it('should return 404 status code ', async done => {
        const res = await request.get('/api/destination/43.387712/12.933535')
        expect(res.status).toBe(404)
        done()
    })
})

/**
 * Testing get destination endpoint for unavailable parking
 * (only available parkings have already been booked)
 */
describe('Get /DESTINATIONS', () => {
    it('should return 404 status code ', async done => {
        const res = await request.get('/api/destination/43.144310/13.066325?maxDistance=100')
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
/*
describe('Delete /COMPANIES', () => {
    it('should delete Company2', async done => {
        const res = await request.delete('/api/companies/Company2')
            .set('Authorization', 'Bearer ' + token)
        expect(res.status).toBe(204)
        done()
    })
})*/

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

//STOP ENDPOINTS
/**
 * Testing get stops endpoint to retrieve all stops for a specific company
 */
describe('Get /STOPS', () => {
    it('should return all stops of Company1 ', async done => {
        const res = await request.get('/api/companies/Company1/stops')
        expect(res.status).toBe(200)
        expect(res.body.status).toBe("success")
        expect(res.body).toHaveProperty('content')
        done()
    });
});

/**
 * Testing get stops endpoint for non existing company
 */
describe('Get /STOPS', () => {
    it('should return 404 status code ', async done => {
        const res = await request.get('/api/companies/CompanyBeta/stops')
        expect(res.status).toBe(404)
        done()
    });
});

/**
 * Testing post to simulate driver arrival for existing booking
 */
describe('Post /STOPS', () => {
    it('should create a new valid stop', async done => {
        const res = await request.post('/api/companies/Company1/stops/start')
            .type('form')
            .send({
                parking: 2,
                plate: "AB111CD"
            })
        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('content')
        expect(res.body.content.valid).toBe(true)
        done()
    })
})

/**
 * Testing post to simulate driver arrival for non existing booking
 */
describe('Post /STOPS', () => {
    it('should create a new invalid stop', async done => {
        const res = await request.post('/api/companies/Company1/stops/start')
            .type('form')
            .send({
                parking: 5,
                plate: "FF567GG"
            })
        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('content')
        expect(res.body.content.valid).toBe(false)
        done()
    })
})

/**
 * Testing post to simulate driver departure
 */
describe('Patch /STOPS', () => {
    it('should update the stop', async done => {
        const res = await request.patch('/api/companies/Company1/stops/end')
            .type('form')
            .send({
                parking: 6,
                plate: "RR145GG"
            })
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('content')
        expect(res.body.content.cost).not.toBeNull()
        done()
    })
})


//BOOKING ENDPOINTS
/**
 * Testing post to create new booking for available parking
 */
describe('Post /BOOKING', () => {
    it('should return 201 status code ', async done => {
        const res = await request.post('/api/companies/Company1/bookings')
            .type('form')
            .send({
                parkingId: 1,
                email: "lorenzo@gmail.com",
                plate: "AB333CD"
            })
        expect(res.status).toBe(201)
        done()
    })
})

/**
 * Testing post to create new booking for not-existing company and parking
 */
describe('Post /BOOKING', () => {
    it('should return 422 status code ', async done => {
        const res = await request.post('/api/companies/CompanyBeta/bookings')
            .type('form')
            .send({
                parkingId: 99,
                email: "lorenzo@gmail.com",
                plate: "AB333CD"
            })
        expect(res.status).toBe(422)
        done()
    })
})

/**
 * Testing post to create new booking for already booked parking
 */
describe('Post /BOOKING', () => {
    it('should return 422 status code ', async done => {
        const res = await request.post('/api/companies/Company1/bookings')
            .type('form')
            .send({
                parkingId: 1,
                email: "lorenzo@gmail.com",
                plate: "AB333CD"
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
        partitaIVA: '20202023498',
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
        partitaIVA: '12345645578',
        address: {
            street: 'Via Buozzi 3',
            city: 'Genova',
            postalCode: 12452
        }
    },
    {
        name: 'Company3',
        email: 'company3@company3.it',
        telephone: 366883456,
        partitaIVA: '56856375869',
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
        address: "Via Le Mosse",
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
        handicap: false,
        indoor: false,
        price: 2.0,
        isApproved: true,
        isUsable: true
    },
    {
        id: 3,
        city: "Camerino",
        address: "Piazzale della Vittoria",
        location: {
            type: "Point",
            coordinates: [
                13.063263,
                43.131306]
        },
        company: "Company1",
        plate: null,
        handicap: false,
        indoor: false,
        price: 3.0,
        isApproved: true,
        isUsable: true
    },
    {
        id: 4,
        city: "Camerino",
        address: "Via Luigi Allevi",
        location: {
            type: "Point",
            coordinates: [
                13.070916,
                43.145485]
        },
        company: "Company1",
        plate: null,
        handicap: false,
        indoor: false,
        price: 0.5,
        isApproved: true,
        isUsable: true
    },
    {
        id: 5,
        city: "Camerino",
        address: "Via Le Mosse",
        location: {
            type: "Point",
            coordinates: [
                13.081280,
                43.143679]
        },
        company: "Company1",
        plate: null,
        handicap: false,
        indoor: false,
        price: 0.5,
        isApproved: true,
        isUsable: true
    },
    {
        id: 6,
        city: "Camerino",
        address: "Via Aldo Moro",
        location: {
            type: "Point",
            coordinates: [
                13.067815,
                43.141491]
        },
        company: "Company1",
        plate: "RR145GG",
        handicap: false,
        indoor: false,
        price: 0.5,
        isApproved: true,
        isUsable: true
    }
]

const stops = [
    {
        driverEmail: "nicola@gmail.com",
        start: new Date(),
        end: null,
        valid: true,
        paid: null,
        parkingId: 6,
        company: "Company1",
        plate: "RR145GG",
        cost: null
    },
    {
        driverEmail: "lorenzo@gmail.com",
        start: new Date(2020, 0, 28, 9, 56),
        end: new Date(2020, 0, 28, 10, 40),
        valid: true,
        paid: null,
        parkingId: 3,
        company: "Company1",
        plate: "AB333CD",
        cost: 3
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

const bookings = [
    {
        company: "Company1",
        parkingId: 2,
        driverEmail: "morena@gmail.com",
        plate: "AB111CD",
        address: {},
        expireAt: moment(new Date()).add(10, 'm').toDate()
    }
]