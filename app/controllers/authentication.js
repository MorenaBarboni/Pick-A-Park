var passport = require("passport");
var mongoose = require("mongoose");
//Import user model
var User = mongoose.model("User");

module.exports.login = function (req, res) {
  passport.authenticate("local", function (err, user, info) {
    var token;
    if (err) {
      res.status(404).json(err);
      return;
    }
    if (user) {
      token = user.generateToken();
      res.status(200);
      res.json({
        token: token
      });
    } else {
      res.status(401).json(info);
    }
  })(req, res);
};

module.exports.register = function (req, res) {
  var user = new User();
  user.name = req.body.name;
  user.surname = req.body.surname;
  user.email = req.body.email;
  user.username = req.body.username;
  user.role = req.body.role;
  if (req.body.company) {
    user.company = req.body.company;
  }
  //Checks that email and password are valid.
  //Checks that user is registering with "institutional" email
  user.setPassword(req.body.password);
  if (user.email == null || !user.password == null) {
    res.status(422);
    res.json({
      message: "emptyError",
    });
  } else if (user.role === "Undefined" || !user.role) {
    res.status(422);
    res.json({
      message: "invalidEmailError",
    });
  } else {
    User.findOne({
      $or: [
        { email: user.email },
        { username: user.username }
      ]
    }, function (err, data) {
      if (data) {
        if (data.email == user.email) {
          res.status(422);
          res.json({
            message: "existingEmailError",
          });
        } else if (data.username == user.username) {
          res.status(422);
          res.json({
            message: "existingUsernameError",
          });
        }
      } else {
        user.save(function (err) {
          var token;
          token = user.generateToken();
          res.status(200);
          res.json({
            message: "User successfully registered",
            token: token
          });
        });
        console.log("User succesfully registered");
      }
    });
  }
};
