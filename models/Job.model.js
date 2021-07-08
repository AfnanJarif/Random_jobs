const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
      type: String,
      required: true,
  },
  recruiterType: {
      type: String,
      required: true,
  },
  recruiterName: {
      type: String,
      required: true,
  },
  payment: {
      type: Number,
      required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("Job", UserSchema);
module.exports = User;
