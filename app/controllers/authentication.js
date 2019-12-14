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
  user.setPassword(req.body.password);
  if (user.email == null || !user.password == null) {
    res.status(422);
    res.json({
      message: "emptyError",
    });
  }  else {
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


//Verify access with token and returns user data
module.exports.verify = function (req, res) {
  if (!req.payload._id) {
    res.status(401).json({
      message: "You're not authorized to access this page"
    });
  } else {
    User.findById(req.payload._id).exec(function (err, user) {
      res.status(200).json(user);
    });
  }
};