var mongoose = require("mongoose");

var companySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    telephone: {
        type: Number,
        default:null
    },

    address: {
        street: { type: String, required:true},
        city: {type: String, required: true},
        postalCode: {type: Number, required:true}
    },
    partitaIVA: {
        type: String,
        required:true

    }
},
    {
        versionKey: false
    });



const Company = (module.exports = mongoose.model("Company", companySchema));