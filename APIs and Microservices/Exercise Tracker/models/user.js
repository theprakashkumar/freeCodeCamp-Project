const mongoose = require("mongoose");
const shortid = require("shortid");
const Exercise = require("./exercise");

var UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  username: String,
  log:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise"
  }],
  count: {
    type:Number,
    default: 0
  }
});

var User = mongoose.model("User", UserSchema);
module.exports = User;