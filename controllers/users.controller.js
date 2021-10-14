require("dotenv").config();
const User = require("../models/User.model");
const Job = require('../models/job.model');

const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const conn = mongoose.createConnection(process.env.MongoURI);
let gfs;

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

const getDashboard = (req, res) => {
  if(req.user.usertype == "recruiter"){
    User.findById(req.user._id).exec( (error, user) => {
      if(user){
        const jobs = [];
        var i = 0
        length = user.jobs.length;
        for(; i < user.jobs.length; i++){
          Job.findById(user.jobs[i]).exec((error, data) => {
            if(data){
              jobs.push(data);
            }

            if(i == user.jobs.length){
              length += 1;
              if(length == user.jobs.length*2){
                res.render("jobs/jobhistory.ejs", {jobs: jobs, req: req});  
              }
            }
          });
        }
        
      }
    });  
  } else {
    res.render("users/dashboard.ejs", { req: req, user:req.user });
  }
}



const getprofile = (req, res) =>{
  res.render("users/profile.ejs", { req: req, user:req.user, errors: req.flash("errors") });
}



const geteditprofile = (req, res) =>{
  res.render("users/editprofile.ejs", { req: req, user:req.user, errors: req.flash("errors") });
}



const geteditdescription = (req, res) =>{
  res.render("users/editdescription.ejs", { req: req, user:req.user, errors: req.flash("errors") });
}



const posteditprofile = (req, res) =>{
  const { 
    name, 
    usertype, 
    phone, 
    age, 
    street,
    thana,
    district,
    userOccupation,
    linkedin,
    facebook,
    password,     
   } = req.body;

  const errors = [];
  if (!name || !usertype || !phone || !age || !street || !thana || !district  || !userOccupation || !password) {
    errors.push("All fields are required!");
  }
  if ( usertype != "recruiter" &&  usertype != "jobseeker") {
    errors.push("Please select a User Type!");
  }

  if (errors.length > 0) {
    req.flash("errors", errors);
    res.redirect("/updateprofile");
  } else {
    User.findOne({ _id: req.user._id })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            user.name = name;
            user.usertype = usertype;
            user.phone = phone;
            user.age = age; 
            user.address.street = street;
            user.address.thana = thana;
            user.address.district = district;
            user.userOccupation = userOccupation;
            user.linkedin = linkedin;
            user.facebook = facebook;
            user
            .save()
            .then((user)=>{
              if(user){
                errors.push("Profile has been updated!");
                req.flash("errors", errors);
                res.redirect("/profile");
              }
            });
          } else {
            errors.push("Password didn't match! Please try again");
            req.flash("errors", errors);
            res.redirect("/updateprofile");
          }
        });
      }  
    }).catch(()=>{
      req.logout();
      let error="User doesn't exits!";
      req.flash("error", error);
      res.redirect("/signin");
    });
  }
}
              

const posteditdescription = (req,res) => {
  const {
    description,
    password,
  } = req.body;

  const errors = [];

  User.findOne({ _id: req.user._id })
  .then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          user.description = description;
          user
          .save()
          .then((user)=>{
            if(user){
              errors.push("Description has been updated!");
              req.flash("errors", errors);
              res.redirect("/profile");
            }
          });
        } else {
          errors.push("Password didn't match! Please try again");
          req.flash("errors", errors);
          res.redirect("/updatedescription");
        }
      });
    }  
  }).catch(()=>{
    req.logout();
    let error="User doesn't exits!";
    req.flash("error", error);
    res.redirect("/signin");
  });
}

const getuploadprofilepic = (req, res) =>{
  res.render("users/uploadprofilepic.ejs",  { req: req, user:req.user, errors: req.flash("errors") } );
}

const insertProfilePicname = (req, res) => {
  const errors = [];
  if(req.user.profilepic != null){
    gfs.remove({ filename: req.user.profilepic, root: 'uploads' }, (err, gridStore) => {
      if (err) {
        gfs.remove({ filename: req.file._id , root: 'uploads' }, (err, gridStore) => {
          if (err) {
            errors.push("Can't delete the profile picture which has been uploaded now!");
            req.flash("errors", errors);
            res.redirect("/profilepic");
          }
        });
        errors.push("Can't delete current Profile Picture");
        req.flash("errors", errors);
        res.redirect("/profilepic");
      }
    });
  }
  
  User.findOne({_id:req.user._id})
  .then((user) => {
    user.profilepic = req.file.filename;
    user
    .save()
    .then(() => {
      errors.push("Profile Picture has been uploaded succfessfully!");
      req.flash("errors", errors);
      res.redirect("/profile");
    })
  }).catch(() => {
    req.logout();
    let error="User doesn't exits!";
    req.flash("error", error);
    res.redirect("/signin");
  });
}

const getPIC = (req,res) => {
  gfs.files.findOne({ filename: req.user.profilepic }, (err, file) => {
    if (!file || file.length === 0) {
      res.redirect("/dashboard");
    }
   else{
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    }
  });
}

const getuploadCV = (req, res) =>{
  res.render("users/uploadcv.ejs",  { req: req, user:req.user, errors: req.flash("errors") } );
}

const insertCVfilename = (req, res) => {
  const errors = [];
  if(req.user.cv != null){
    gfs.remove({filename: req.user.cv, root: 'uploads' }, (err, gridStore) => {
      if (err) {
        gfs.remove({filename: req.file.filename , root: 'uploads' }, (err, gridStore) => {
          if (err) {
            errors.push("Can't delete the CV which has been uploaded now!");
            req.flash("errors", errors);
            res.redirect("/cv");
          }
        });
        errors.push("Can't delete cv");
        req.flash("errors", errors);
        res.redirect("/cv");
      }
    });
  }

  User.findOne({_id:req.user._id})
  .then((user) => {
    user.cv = req.file.filename;
    user
    .save()
    .then(() => {
      errors.push("CV has been uploaded succfessfully!");
      req.flash("errors", errors);
      res.redirect("/profile");
    })
  }).catch(() => {
    req.logout();
    let error="User doesn't exits!";
    req.flash("error", error);
    res.redirect("/signin");
  });;
}

const getCV = (req,res) => {
  gfs.files.findOne({ filename: req.user.cv }, (err, file) => {
    if (!file || file.length === 0) {
      res.redirect("/dashboard");
    }
   else{
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    }
  });
}

module.exports = {
  getDashboard,

  getprofile,
  geteditprofile,
  posteditprofile,
  
  geteditdescription,
  posteditdescription,

  getuploadprofilepic,
  insertProfilePicname,
  getPIC,

  getuploadCV,
  insertCVfilename,
  getCV,

};