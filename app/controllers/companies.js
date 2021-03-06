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

module.exports.newCompany = function (req, res) {
  var newCompany = new Company();
  newCompany.name = req.body.name;
  newCompany.email = req.body.email;
  newCompany.telephone = req.body.telephone;
  newCompany.partitaIVA = req.body.partitaIVA;
  newCompany.address.street = req.body.street;
  newCompany.address.city = req.body.city;
  newCompany.address.postalCode = req.body.postalCode;
  Company.findOne({
    name: newCompany.name
  }, function (err, data) {
    if (data) {
      res.status(422);
      res.json({
        message: "existingCompanyError"
      })
    } else {
      newCompany.save(function (err) {
        res.status(201);
        res.json({
          code: "201",
          status: "success",
          message: "Resource successfully created",
          content: newCompany
        });
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


