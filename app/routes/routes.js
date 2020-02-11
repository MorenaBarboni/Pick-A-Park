//API routes
//Initialize express router
var express = require("express");
var router = express.Router();
var jwt = require("express-jwt");
var auth = require("../config/auth");

//Import backend controllers
const ctrlAuth = require("../controllers/authentication");
const ctrlParking = require("../controllers/parkings");
const ctrlCompany = require("../controllers/companies");
const ctrlDriver = require("../controllers/driver");
const ctrlStop = require("../controllers/stops");
const ctrlBooking = require("../controllers/bookings");

// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API is Working',
        message: 'Welcome to pick-a-park!'
    });
});

// Webapp User
router.post("/login", ctrlAuth.login);
router.post("/users", ctrlAuth.register);
router.get("/users", auth, ctrlAuth.verify);

//Driver
router.post("/driver-login", ctrlDriver.login);
router.post("/driver", ctrlDriver.register);

//Parking Companies
router.get("/companies", ctrlCompany.getCompanies);
router.get("/companies/:name", ctrlCompany.getCompanyByName);
router.post("/companies", auth, ctrlCompany.newCompany);
router.delete("/companies/:name", auth, ctrlCompany.deleteCompany);

//Parkings
router.get("/companies/:name/parkings", auth, ctrlParking.getParkings);
router.get("/companies/:name/parkings/:id", auth, ctrlParking.getParkingById);
router.post("/companies/:name/parkings", auth, ctrlParking.newParking);
router.delete("/companies/:name/parkings/:id", auth, ctrlParking.deleteParking);
router.patch("/companies/:name/parkings/:id", auth, ctrlParking.updateParking);

//Bookings
router.post("/companies/:name/bookings", ctrlBooking.newBooking);

//Stops
router.get("/companies/:name/stops", ctrlStop.getStops);
router.patch("/companies/:name/stops/:id", ctrlStop.updateStop); 

//Stops simulation
router.post("/companies/:name/stops/start", ctrlStop.stopArrival);
router.patch("/companies/:name/stops/end", ctrlStop.stopDeparture);

//Destination
router.get("/destination/:lat/:long", ctrlParking.getDestination);

// Export API routes
module.exports = router;
