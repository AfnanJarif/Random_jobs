const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  recruiterID: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  jobdescription:{
    type: String,
    required: true,
  },
  jobtype: {
    type: String,
    required: true,
  },
  document:{
    type: String,
    default: null,
  },
  startdate: {
    type: Date,
    required: true,
  },
  enddate: {
    type: Date,
    required: true,
  },
  location: {
    union: {
      type: String,
      required: true,
    },
    thana: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    }
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

const Job = mongoose.model("Job", JobSchema);
module.exports = Job;
