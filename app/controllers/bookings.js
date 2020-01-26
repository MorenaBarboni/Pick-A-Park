var mongoose = require("mongoose");
var Booking = mongoose.model("Booking");

module.exports.newBooking = function (req, res) {
  var booking = new Booking();
  booking.company = req.params.name;
  booking.parkingId = req.body.parkingId;
  booking.plate = req.body.plate;
  booking.driverEmail = req.body.email;

  Booking.findOne({
    parkingId: booking.parkingId,
    company: booking.company
  }, function (err, data) {
    if (data) {
      res.status(422);
      res.json({
        code: "422",
        message: "The requested parking has already been booked"
      })
    } else {
      booking.save(function (err) {
        res.status(201);
        res.json({
          code: "201",
          status: "success",
          message: "Resource successfully created",
          content: booking
        });
      });
    }
  })
}

