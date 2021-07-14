const Job = require('../models/Job.model')
const User = require("../models/User.model");

const getJobCreation = (req, res) => {
    res.render("jobs/jobCreation.ejs", { errors: req.flash("errors"), req: req });
}

const postJobCreation = (req, res) => {
    const {name, category, jobtype, jobdescription, payment } = req.body;

    User.findById(req.user._id).exec(async (error, user) => {
      if(user){
        const newJob = new Job({
          name: name,
          category: category,
          jobtype: jobtype,
          recruiterID: req.user._id,
          jobdescription: jobdescription,
          payment: payment,
        });
        newJob.save((error, data) => {
          if (error) {
            return res.status(400).json({ error });
          }
  
          if (data) {
            User.findOneAndUpdate(
              { _id: req.user._id },
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
                  .then((user) => res.redirect("/dashboard"))
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

  const jobs = [];

  User.findById(req.user._id).exec((error, user) => {

    if(user){
      for(var i = 0; i < user.jobs.length; i++){
        Job.findById(user.jobs[i]).exec((error, data) => {
          if(data){
            jobs.push(data);
          } 
          if(i == user.jobs.length){
            res.render("jobs/job.ejs", {jobs: jobs, req: req});  
          }
        }); 
      }
    }
  });  
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