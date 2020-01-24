var mongoose = require("mongoose");
var Stop = mongoose.model("Stop");


//Get all stops for a company
module.exports.getStops = function (req, res) {
  Stop.find({ company: req.params.name })
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
