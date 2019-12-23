var jwt = require('express-jwt');
module.exports = jwt({
    secret: process.env.secret,
    userProperty: 'payload'
});

