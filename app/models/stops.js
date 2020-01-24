var mongoose = require("mongoose");

var stopSchema = new mongoose.Schema({
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
    default: null
  },
  start: {
    type: Date,
    default: null
  },
  end: {
    type: Date,
    default: null
  },
  cost: {
    type: Number
  },
  valid: {
    type: Boolean,
    default: false
  },
  paid: {
    type: Boolean,
    default: false
  }
},
  {
    versionKey: false
  });

const Stop = (module.exports = mongoose.model("Stop", stopSchema));