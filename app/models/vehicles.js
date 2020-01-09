var mongoose = require("mongoose");

var vehicleSchema = new mongoose.Schema({
  driver: {
    type: String,
    required: true
  },
  plate: {
    type: String,
    required: true
  },
  fuel: {
    type: String,
    required: true
  },
  size: {
    type: String
  },
  type: {
    enum: ['Car', 'Motorbike', 'Camper'],
  }
},
  {
    versionKey: false
  });

const Driver = (module.exports = mongoose.model("Vehicle", vehicleSchema));