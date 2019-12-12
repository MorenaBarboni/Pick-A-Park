var mongoose = require("mongoose");
var Parking = mongoose.model("Parking");


//Get all parkings
module.exports.getParkings = function (req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      message: "You're not authorized to access this resource"
    });
  } else {
    Parking.find({})
      .sort({ number: 1 })
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



