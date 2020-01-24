var mongoose = require("mongoose");

var bookingSchema = new mongoose.Schema({
  parkingId: {
    type: Number,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  plate: {
    type: String,
    required: true
  },
  driverEmail: {
    type: String,
    required: true
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: '10m' },
  },
},
  {
    versionKey: false
  });

const Booking = (module.exports = mongoose.model("Booking", bookingSchema));