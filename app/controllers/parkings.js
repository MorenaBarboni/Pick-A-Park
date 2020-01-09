var mongoose = require("mongoose");
var Parking = mongoose.model("Parking");


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
  parking.coordinates.latitude = req.body.latitude;
  parking.coordinates.longitude = req.body.longitude;
  parking.indoor = req.body.indoor;
  parking.handicap = req.body.handicap;
  parking.price = req.body.price;
  parking.isUsable = true;
  parking.isApproved = false;
  parking.plate = null;
  parking.isFree = true;

  //Check that parking id is unique for the company
  //Check that coordinates are unique
  Parking.findOne({
    $or: [
      { id: parking.id, company: parking.company },
      {
        coordinates: {
          latitude: parking.coordinates.latitude,
          longitude: parking.coordinates.longitude
        }
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