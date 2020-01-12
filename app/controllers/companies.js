var mongoose = require("mongoose");
var Company = mongoose.model("Company");
var Parking = mongoose.model("Parking");

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


//Delete Company and its resources
module.exports.deleteCompany = function (req, res) {
  Company.findOneAndRemove(
    {
      name: req.params.name
    },
    function (err, parking) {
      if (err) {
        console.log(err);
      } else {
        if (!parking) {
          res.status(404).json({
            code: 404,
            message: "The resource is not available"
          });
        } else {
          res.status(204).json({
            code: "204",
            status: "success",
            message: "Resource successfully deleted",
          });
        }
      }
    } //Delete all parkings of company
  ).then(Parking.deleteMany(
    {
      company: req.params.name
    }, function (err, parking) {
      if (err) {
        console.log(err);
      }
    }
  ))
};


