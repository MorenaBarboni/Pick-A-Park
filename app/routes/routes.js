//API routes
//Initialize express router
var express = require("express");
var router = express.Router();
var jwt = require("express-jwt");
var auth = require("../config/auth");

//Import backend controller
var ctrlAuth = require("../controllers/authentication");

// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API is Working',
        message: 'Welcome to pick-a-park!'
    });
});

// Authentication and Registration API
router.post("/login", ctrlAuth.login);
router.post("/users", ctrlAuth.register);
router.get("/users", auth, ctrlAuth.verify);

// Export API routes
module.exports = router;
