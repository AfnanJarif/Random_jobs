const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  usertype: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    unique: true,
    required: true,
    validate : {
        validator : Number.isInteger,
        message   : '{VALUE} is not an integer value'
      }
  },
  userOccupation: {
      type: String,
  },
  age: {
    type: Number,
  },
  address: {
      street:{
        type: String,
      },
      thana: {
          type: String,
      },
      district: {
          type: String,
      }
  },
  description:{
    type: String,
    deafult: null,
  },
  jobs:[{
    type: String,
  }],
  wishlistID: {
    type: String,
  },
  ratingID: {
    type: String,
  },
  otpcode:{
    type: String,
  },
  otpcodetime:{
    type: Date,
  },
  profilepic:{
    type: String,
    default: null,
  },
  cv:{
    type: String,
    default: null,
  },
  linkedin:{
    type: String,
    default: null,
  },
  facebook:{
    type: String,
    default: null,
  }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
