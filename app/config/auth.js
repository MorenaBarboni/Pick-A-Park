var jwt = require('express-jwt');
module.exports = jwt({
    secret: 'testSecret',
    userProperty: 'payload'
});

