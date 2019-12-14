var mongoose = require("mongoose");
var Company = mongoose.model("Company");


//Get all companies
module.exports.getCompanies = function (req, res) {

  Company.find({})
    .sort({ number: 1 })
    .exec(function (err, companies) {
      if (!companies.length) {
        res.status(404).json({
          message: "The requested resource is not available"
        });
      } else {
        res.status(200);
        res.json({
          code: "200",
          status: "success",
          message: "Resource successfully retrieved",
          content: companies
        });
      }
    });

};

//Get company by name
module.exports.getCompanyByName = function (req, res) {

  Company.find({ name: req.params.name })
    .exec(function (err, companies) {
      if (!companies.length) {
        res.status(404).json({
          message: "The requested resource is not available"
        });
      } else {
        res.status(200);
        res.json({
          code: "200",
          status: "success",
          message: "Resource successfully retrieved",
          content: companies
        });
      }
    });
};


