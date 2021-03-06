var mongoose = require("mongoose");
var Stop = mongoose.model("Stop");
var Booking = mongoose.model("Booking");
var Parking = mongoose.model("Parking");
var moment = require("moment");


//Get all stops (for a company or driver)
module.exports.getStops = function (req, res) {

  var company = req.query.company;
  var plate = req.query.plate;
  var email = req.query.email; //driverEmail

  var query = {};

  if (company) {
    query.company = company;
  }
  if (plate) {
    query.plate = plate;
  }
  if (email) {
    query.driverEmail = email;
  }
  Stop.find(query)
    .sort({ parkingId: 1 })
    .exec(function (err, stops) {
      if (!stops.length) {
        res.status(404).json({
          message: "The requested resource is not available"
        });
      } else {
        res.status(200);
        res.json({
          code: "200",
          status: "success",
          message: "Resource successfully retrieved",
          content: stops
        });
      }
    });
};


//Pay stop
module.exports.updateStop = function (req, res) {
  Stop.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      $set: {
        paid: Date.now()
      }
    },
    {
      new: true
    },
    function (err, stop) {
      if (err) {
        console.log(err);
      } else {
        if (!stop) {
          res.status(404).json({
            code: 404,
            message: "The resource is not available"
          });
        } else {
          res.status(200);
          res.json({
            code: "200",
            status: "success",
            message: "Resource successfully updated",
            content: stop
          });

        }
      }
    });
};

//Simulates driver arrival
module.exports.stopArrival = function (req, res) {
  Booking.findOne({ company: req.body.company, parkingId: req.body.parking, plate: req.body.plate })
    .exec(function (err, booking) {
      var stop = new Stop();
      stop.parkingId = req.body.parking;
      stop.company = req.body.company;
      stop.plate = req.body.plate;
      stop.start = new Date();
      stop.end = null;
      stop.paid = null;
      stop.cost = null;
      if (!booking) {
        //If there is no booking -> Create new invalid stop
        stop.driverEmail = null;
        stop.valid = false;
      } else {
        stop.driverEmail = booking.driverEmail;
        stop.valid = true;
      }
      //Update parking plate
      Parking.findOneAndUpdate(
        {
          id: req.body.parking,
          company: req.body.company
        },
        {
          $set: {
            plate: req.body.plate
          }
        },
        function (err, parking) {
          if (err) {
            console.log(err);
          } else {
            stop.save(function (err) {
              res.status(201);
              res.json({
                code: "201",
                status: "success",
                message: "Resource successfully created",
                content: stop
              });
            });
          }
        });
    });
};


//Simulates driver departure
module.exports.stopDeparture = function (req, res) {
  Parking.findOneAndUpdate({ company: req.body.company, id: req.body.parking }, {
    $set: {
      plate: null
    }
  })
    .exec(function (err, parking) {
      if (!parking) {
        console.log("Error: no parking");
        res.status(404).json({
          code: 404,
          message: "The resource is not available"
        });
      } else {
        Stop.findOne({
          company: req.body.company,
          parkingId: req.body.parking,
          start: { $ne: null },
          end: null,
          plate: req.body.plate
        })
          .exec(function (err, stop) {
            if (!stop) {
              console.log("Error: No active stop for the selected parking");
              res.status(404).json({
                code: 404,
                message: "The resource is not available"
              });
            } else {
              var stopEnd = new Date();
              //Optional end param for testing
              if (req.body.end) {
                stopEnd = (new Date(req.body.end));
              }
              var diffHrs = Math.ceil((Math.abs(new Date(stopEnd) - new Date(stop.start)) / 3600000));
              var stopCost = parking.price * diffHrs;
              var stopPaid = null;

              Stop.findOneAndUpdate(
                {
                  _id: stop._id
                },
                {
                  $set: {
                    cost: stopCost,
                    end: stopEnd,
                    paid: stopPaid
                  }
                },
                {
                  new: true //returns updated document
                },
                function (err, stop) {
                  if (err) {
                    console.log(err);
                  } else {
                    if (!stop) {
                      res.status(404).json({
                        code: 404,
                        message: "The resource is not available"
                      });
                    } else {
                      res.status(200);
                      res.json({
                        code: "200",
                        status: "success",
                        message: "Resource successfully updated",
                        content: stop
                      });

                    }
                  }
                });
            }
          });
      }
    });
};