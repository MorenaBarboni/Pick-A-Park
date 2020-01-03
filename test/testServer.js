/* TEST SERVER */

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');

//dotenv
require('dotenv').config()
// Test Database configuration
require('../app/config/test.db');
//Passport configuration
require('../app/config/passport');

// Import API routes
var routesApi = require('../app/routes/routes');

//Initialize the app
var app = express();
app.use(logger('dev'));

// Configure bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Passport 
app.use(passport.initialize());

// API routes used when path starts with /api
app.use('/api', routesApi);

app.use(function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({ "message": err.name + ": " + err.message });
  }
});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
