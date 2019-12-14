var mongoose = require("mongoose");

var companySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
},
    {
        versionKey: false
    });



const Company = (module.exports = mongoose.model("Company", companySchema));