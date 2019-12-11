var mongoose = require("mongoose");

var parkingSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    plate: {
        type: String,
        default: null
    },
    coordinates: {
        latitude: { type: String, required: true },
        longitude: { type: String, required: true }
    },
    isFree: {
        type: Boolean,
        default: true
    },
    handicap: {
        type: Boolean,
        default: false
    },
    indoor: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default: 0.0
    },
    company: {
        type: String,
        default: null
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    isUsable: {
        type: Boolean,
        default: true
    },
});
const Parking = (module.exports = mongoose.model("Parking", parkingSchema));