var mongoose = require("mongoose");

var driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  phone: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  payment: {
    type: String
  },
  address: {
    latitude: { type: Number },
    longitude: { type: Number }
  }
},
  {
    versionKey: false
  });

const Driver = (module.exports = mongoose.model("Driver", driverSchema));