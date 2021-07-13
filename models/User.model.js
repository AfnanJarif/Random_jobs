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
      required: true,
  },
  age: {
    type: Number,
    required: true
  },
  address: {
      thana: {
          type: String,
          required: true,
      },
      district: {
          type: String,
          required: true,
      }
  },
  jobs:[{
    type: String,
  }],
  wishlistID: {
    type: String,
  },
  ratingID: {
    type: String,
  }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
