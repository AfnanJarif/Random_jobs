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
  occupation: {
      type: String,
      required: true,
  },
  address: {
      Street: {
          type: String,
          required: true,
      },
      City: {
          type: String,
          required: true,
      }
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
