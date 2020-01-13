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

module.exports.newCompany = function(req, res){
  var newCompany = new Company();
  newCompany.name = req.body.name;
  newCompany.email = req.body.email;
  newCompany.telephone = req.body.telephone;
  newCompany.partitaIVA = req.body.partitaIVA;
  newCompany.address.street = req.body.street;
  newCompany.address.city = req.body.city;
  newCompany.address.postalCode = req.body.postalCode;
  
  Company.findOne({
    $or:[
      {
        name: newCompany.name
      }
    ]
  },function (err,data) {
    if(data){
      if(data.name===newCompany.name){
        res.status(422);
        res.json({
          code:"422",
          message: "existingCompanyError"
        })
      }
    }else{
      newCompany.save(function (err) {
        res.status(201);
        res.json({
          code: "201",
          status: "success", 
          message: "Company successfully added",
          content: newCompany
        });
      });
    }
  });
};


