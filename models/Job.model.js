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
  jobdescription:{
    tyoe: String,
    required: true,
  },
  recruiterID: {
      type: String,
      required: true,
  },
  payment: {
      type: Number,
      required: true,
  },
  requests: [{
    type: String,
  }],
  assigned: {
    type: String,
  },
  done: {
    type: Boolean,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("Job", UserSchema);
module.exports = User;
