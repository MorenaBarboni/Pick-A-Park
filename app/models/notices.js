var mongoose = require("mongoose");

var noticeSchema = new mongoose.Schema({
  stopId: {
    type: String,
    required: true
  },
  solved: {
    type: Boolean,
    default: false
  },
  company: {
    type: String,
    required: true
  },
  sentBy: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  }
},
  {
    versionKey: false
  });

const Notice = (module.exports = mongoose.model("Notice", noticeSchema));