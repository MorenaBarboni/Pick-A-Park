//API routes
//Initialize express router
var express = require("express");
var router = express.Router();

// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API is Working',
        message: 'Welcome to pick-a-park!'
    });
});

// Export API routes
module.exports = router;
