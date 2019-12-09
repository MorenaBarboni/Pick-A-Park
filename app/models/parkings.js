var mongoose = require("mongoose");


var parkingSchema = new mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    plate: { type: String, default: null },
    coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    isFree: { type: Boolean, default: true },
    handicap: { type: Boolean, default: false },
    indoor: { type: Boolean, default: false },
    price: { type: Number, default: 0.0 },
    company: { type: String, default: null },
    approval: { type: Boolean, default: false },
    isUsable: { type: Boolean, default: true },
});

mongoose.model("Parking", parkingSchema);