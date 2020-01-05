var mongoose = require("mongoose");
var Driver = mongoose.model("Driver");

//POST - Register driver
module.exports.register = function (req, res) {
  var driver = new Driver();
  driver.name = req.body.name;
  driver.surname = req.body.surname;
  driver.email = req.body.email;
  driver.username = req.body.username;
  driver.phone = req.body.phone;
  driver.password = req.body.password;
  driver.address = {};
  driver.payment = null;
  console.log(driver)

  Driver.findOne({
    $or: [
      { email: driver.email },
      { phone: driver.phone },
      { username: driver.username }
    ]
  }, function (err, existingDriver) {
    if (existingDriver) {
      res.status(422);
      res.json({
        message: "Error: User already exists!",
      });
    } else {
      driver.save(function (err) {
        res.status(200);
        res.json({
          message: "User successfully registered"
        });
      });
     }
  });
};