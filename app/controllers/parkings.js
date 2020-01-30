var mongoose = require("mongoose");
var Parking = mongoose.model("Parking");
var Booking = mongoose.model("Booking");


//Get all parkings
module.exports.getParkings = function (req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      message: "You're not authorized to access this resource"
    });
  } else {
    Parking.find({ company: req.params.name })
      .sort({ id: 1 })
      .exec(function (err, parkings) {
        if (!parkings.length) {
          res.status(404).json({
            message: "The requested resource is not available"
          });
        } else {
          res.status(200);
          res.json({
            code: "200",
            status: "success",
            message: "Resource successfully retrieved",
            content: parkings
          });
        }
      });
  }
};

module.exports.getParkingById = function (req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      message: "You're not authorized to access this resource"
    });
  } else {
    Parking.findOne({ company: req.params.name, id: req.params.id })
      .sort({ number: 1 })
      .exec(function (err, parking) {
        if (!parking) {
          res.status(404).json({
            message: "The requested resource is not available"
          });
        } else {
          res.status(200);
          res.json({
            code: "200",
            status: "success",
            message: "Resource successfully retrieved",
            content: parking
          });
        }
      });
  }
};

//Add new parking to company
module.exports.newParking = function (req, res) {
  var parking = new Parking();
  parking.company = req.params.name;
  parking.id = req.body.id;
  parking.city = req.body.city;
  parking.address = req.body.address;

  parking.location = {
    type: "Point",
    coordinates: [
      req.body.longitude,
      req.body.latitude]
  },
    parking.indoor = req.body.indoor;
  parking.handicap = req.body.handicap;
  parking.price = req.body.price;
  parking.isUsable = true;
  parking.isApproved = false;
  parking.plate = null;

  //Check that parking id is unique for the company
  //Check that coordinates are unique
  Parking.findOne({
    $or: [
      { id: parking.id, company: parking.company },
      {
        location: parking.location
      }
    ]
  }, function (err, data) {
    if (data) {
      if (data.id === parking.id && data.company === parking.company) {
        res.status(422);
        res.json({
          code: "422",
          message: "existingParkingError"
        })
      } else {
        res.status(422);
        res.json({
          code: "422",
          message: "existingCoordError",
        });
      }

    } else {
      parking.save(function (err) {
        res.status(201);
        res.json({
          code: "201",
          status: "success",
          message: "Resource successfully created",
          content: parking
        });

      });
    }
  })
}


//Delete Parking
module.exports.deleteParking = function (req, res) {
  Parking.findOneAndRemove(
    {
      id: req.params.id,
      company: req.params.name
    },
    function (err, parking) {
      if (err) {
        console.log(err);
      } else {
        if (!parking) {
          res.status(404).json({
            code: 404,
            message: "The resource is not available"
          });
        } else {
          res.status(204).json({
            code: "204",
            status: "success",
            message: "Resource successfully deleted",
          });
        }
      }
    }
  );
};


//Patch parking by id (update price, isUsable, isApproved)
module.exports.updateParking = function (req, res) {
  Parking.findOneAndUpdate(
    {
      id: req.params.id,
      company: req.params.name
    },
    {
      $set: {
        price: req.body.price,
        isUsable: req.body.isUsable,
        isApproved: req.body.isApproved
      }
    },
    {
      new: true //returns updated document
    },
    function (err, parking) {
      if (err) {
        console.log(err);
      } else {
        if (!parking) {
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
            content: parking
          });

        }
      }
    });
};


//Get closest available parking to destination
module.exports.getDestination = function (req, res) {
  var destLat = parseFloat(req.params.lat);
  var destLong = parseFloat(req.params.long);

  var IsAccessible = req.query.access;
  var isIndoor = req.query.indoor;
  var maxDistance = 1000; //m
  if (req.query.maxDistance) {
    maxDistance = parseInt(req.query.maxDistance);
  }
  var query = {
    handicap: false,
    plate: null,
    isUsable: true,
    isApproved: true
  };
  //If indoor parameter is present add it to query
  if (isIndoor) {
    var setIndoor = (isIndoor == 'true');
    query.indoor = setIndoor;
  }
  //If isAccessible parameter is present add it to query
  if (IsAccessible) {
    var setAccessible = (IsAccessible == 'true');
    query.handicap = setAccessible;
  }

  Parking.aggregate(
    [{
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [destLong, destLat]
        },
        distanceField: "distance",
        maxDistance: maxDistance,
        spherical: true,
        query: query
      }
    }])
    .exec(function (err, parkings) {
      if (!parkings) {
        res.status(404).json({
          message: "No available parkings"
        });
      } else {
        //Remove booked parkings from results
        Booking.find({})
          .exec(function (err, bookings) {

            var bookingIds = [];
            var result = null;

            bookings.forEach(b => {
              bookingIds.push(b.parkingId);
            });
            for (i = 0; i < parkings.length; i++) {
              if (!bookingIds.includes(parkings[i].id)) {
                result = parkings[i];
                break;
              }
            }
            if (result) {
              res.status(200);
              res.json({
                code: "200",
                status: "success",
                message: "Resource successfully retrieved",
                content: result
              });
            } else {
              res.status(404).json({
                message: "No available parkings"
              });
            }
          });
      }
    });
};