const Job = require('../models/Job.model')
const User = require("../models/User.model");

const getJobCreation = (req, res) => {
    res.render("jobs/jobCreation.ejs");
}

const postJobCreation = (req, res) => {
    const {_id, name, category, jobdescription, payment } = req.body;

    User.findById(_id).exec(async (error, user) => {
      if(user){
        const newJob = new Job({
          name: name,
          category: category,
          recruiterID: _id,
          jobdescription: jobdescription,
          payment: payment,
        });
        newJob.save((error, data) => {
          if (error) {
            return res.status(400).json({ error });
          }
  
          if (data) {
            User.findOneAndUpdate(
              { _id: _id },
              {
                $push: {jobs : data._id },
              },
              {
                new: true,
              }
            ).exec(async (error, user) => {
              if (error) return res.status(400).json({ message: error });
              if (user) {
                user
                  .save()
                  .then((user) => res.json({ user, data }))
                  .catch((err) => console.log(err));
              } else {
                return res.status(200).json({ message: "no such user" });
              }
            });
          }
        });
      }
    })
}

const getJob = (req, res) => {

  const _id = req.body;

  Job.findById(_id).exec(async (error, job) => {
    if(job){
      User.findById(job.recruiterID).exec(async (error, user) => {
        res.send([job, user]);
      })
    }
  });
  //res.render("jobs/job.ejs", { error: req.flash("error") });
}

const jobRequests = (req,res) => {

  const {_id, u_id} = req.body;

  Job.findOneAndUpdate(
    { _id: _id },
    {
      $push: {requests : u_id },
    },
    {
      new: true,
    }
  ).exec(async (error, job) => {
    if (error) return res.status(400).json({ message: error });
    if (job) {
      job
        .save()
        .then((job) => res.json({ job }))
        .catch((err) => console.log(err));
    } else {
      return res.status(200).json({ message: "no instructor" });
    }
  });
}

const jobAssigned = (req,res) => {

  const {_id, u_id} = req.body;

  Job.findOneAndUpdate(
    { _id: _id }, 
    {assigned : u_id },
    {
      new: true,
    }
  ).exec(async (error, job) => {
    if (error) return res.status(400).json({ message: error });
    if (job) {
      job
        .save()
        .then((job) => res.json({ job }))
        .catch((err) => console.log(err));
    } else {
      return res.status(200).json({ message: "no instructor" });
    }
  });
}

const jobDone = (req,res) => {

  const {_id} = req.body;

  Job.findOneAndUpdate(
    { _id: _id },
    {done : true },
    {
      new: true,
    }
  ).exec(async (error, job) => {
    if (error) return res.status(400).json({ message: error });
    if (job) {
      job
        .save()
        .then((job) => res.json({ job }))
        .catch((err) => console.log(err));
    } else {
      return res.status(200).json({ message: "no instructor" });
    }
  });
}

module.exports = {
  getJobCreation, 
  postJobCreation, 
  getJob,
  jobRequests,
  jobAssigned,
  jobDone
};