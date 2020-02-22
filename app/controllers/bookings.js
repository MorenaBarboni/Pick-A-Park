var mongoose = require("mongoose");
var Booking = mongoose.model("Booking");
var Parking = mongoose.model("Parking");


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
      //Check that requested parking exists and is available
      Parking.findOne({
        id: booking.parkingId,
        company: booking.company,
        isUsable: true,
        isApproved: true,
        plate: null
      }, function (err, data) {
        if (data) {
          //Delete any previous booking for the user
          Booking.findOneAndRemove(
            {
              driverEmail: booking.driverEmail,
            },
            function (err, booking) {
              if (err) {
                console.log(err);
              } else {
                if (booking) {
                  console.log("Previous booking deleted.");
                }
              }
            }
          );
          booking.save(function (err) {
            res.status(201);
            res.json({
              code: "201",
              status: "success",
              message: "Resource successfully created",
              content: booking
            });
          });
        } else {
          res.status(422);
          res.json({
            code: "422",
            message: "The requested resource is not available"
          })
        }
      })
    }
  })
}
