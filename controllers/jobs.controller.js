const Job = require('../models/job.model')
const User = require("../models/User.model");

const getJobCreation = (req, res) => {
    res.render("jobs/jobCreation.ejs", { errors: req.flash("errors"), req: req });
}

const postJobCreation = (req, res) => {
  const errors = [];

  const {
    name, 
    category, 
    jobtype, 
    startdate,
    enddate,
    union,
    thana,
    district,
    payment, 
    jobdescription,
  } = req.body;

  if (!name || !category || !jobtype || !startdate || !enddate || !union || !thana || !district || !payment) {
    errors.push("All fields are required!");
  }

  if(isNaN(payment)){
    errors.push("Payment must be in number!");
  }

  if(errors>0){
    req.flush("erros", errors);
    res.redirect("/jobcreation");
  } else{
    User.findById(req.user._id).exec(async (error, user) => {
      if(user){
        const newJob = new Job({
          name: name,
          recruiterID: req.user._id,
          category: category,
          jobtype: jobtype,
          startdate: startdate,
          enddate: enddate,
          location : {
            union: union,
            thana: thana,
            district: district,
          },          
          payment: payment,
          jobdescription: jobdescription,
          document: req.file.filename,
        });

        newJob.save((error, data) => {
          if (error) {
            errors.push("Something is wrong while saving the JOB! Please try again")
            req.flush("erros", errors);
            res.redirect("/jobcreation");
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
              if (error){
                req.logout();
                errors.push("Fabricated request!");
                req.flush("erros", errors);
                res.redirect("/signin");
              }
              if (user) {
                user
                .save()
                .then(() => res.redirect("/dashboard"))
                .catch(() =>{
                  errors.push("Something is wrong while saving the JOB! Please try again");
                  req.flush("erros", errors);
                  res.redirect("/jobcreation");
                });
              }
            });
          }
        });
      }
    })
  }
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