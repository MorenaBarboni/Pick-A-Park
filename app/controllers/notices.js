var mongoose = require("mongoose");
var Notice = mongoose.model("Notice");

//Add new notice
module.exports.newNotice = function (req, res) {
  var notice = new Notice();
  notice.stopId = req.body.stopId;
  notice.company = req.body.company;
  notice.sentBy = req.body.email;
  notice.timestamp = Date.now();
  notice.solved = false;

  //Check that notice is unique for the stop
  Notice.findOne({
    stopId: notice.stopId
  }, function (err, data) {
    if (data) {
      res.status(422);
      res.json({
        code: "422",
        message: "existingNoticeError",
      });
    } else {
      notice.save(function (err) {
        res.status(201);
        res.json({
          code: "201",
          status: "success",
          message: "Resource successfully created",
          content: notice
        });

      });
    }
  })
}