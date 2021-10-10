require("dotenv").config();
const User = require("../models/User.model");
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
  res.render("users/dashboard.ejs", { req: req, user:req.user });
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
      errors.push("User doesn't exits!");
      req.flash("errors", errors);
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
    errors.push("User doesn't exits!");
    req.flash("errors", errors);
    res.redirect("/signin");
  });
}



module.exports = {
  getDashboard,
  getprofile,
  geteditprofile,
  geteditdescription,
  posteditprofile,
  posteditdescription,
};