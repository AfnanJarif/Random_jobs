const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const getLogin = (req, res) => {
  res.render("users/login.ejs", { error: req.flash("error") });
};

const postLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
};

const getRegister = (req, res) => {
  res.render("users/register.ejs", { errors: req.flash("errors") });
};

const postRegister = (req, res) => {
  const { name, 
    email, 
    password, 
    confirm_password, 
    usertype, 
    phone, 
    occupation,
    age, 
    street, 
    city, 
    recruitertype } = req.body;


  //Data Validation
  const errors = [];
  if (!name || !email || !password || !confirm_password || !usertype || !phone || !occupation || !street || !city) {
    errors.push("All fields are required!");
  }
  if (password.length < 6) {
    errors.push("Password must be at least 6 characters!");
  }
  if (password !== confirm_password) {
    errors.push("Passwords do not match!");
  }

  if (errors.length > 0) {
    req.flash("errors", errors);
    res.redirect("/users/register");
  } else {
    //Create New User
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push("User already exists with this email!");
        req.flash("errors", errors);
        res.send(errors);
        //res.send(user);
        //res.redirect("/users/register");
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            errors.push(err);
            req.flash("errors", errors);
            res.send(err);
            //res.redirect("/users/register");
          } else {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) {
                errors.push(err);
                req.flash("errors", errors);
                res.send(err);
                //res.redirect("/users/register");
              } else {
                const newUser = new User({
                  address: {
                    street: street, 
                    city: city,
                  },
                  name: name,
                  email: email,
                  password: hash,
                  usertype: usertype, 
                  phone: phone, 
                  occupation: occupation,
                  age: age 
                });
                newUser
                  .save()
                  .then(() => {
                    if(usertype.toLowerCase() == 'recruiter'){
                      User.findOneAndUpdate(
                        { _id: newUser._id },
                        {recruitertype : recruitertype },
                        {
                          new: true,
                        }
                      ).exec(async (error, user) => {
                        if (error) return res.status(400).json({ message: error });
                        if (user) {
                          user
                            .save()
                            .then((user) => res.json({ user }))
                            .catch((err) => console.log(err));
                        }
                      });
                    }
                    //res.send(newUser);
                    //res.redirect("/users/login");
                  })
                  .catch(() => {
                    errors.push("Saving User to the daatabase failed!");
                    req.flash("errors", errors);
                    res.send(newUser);
                    //res.redirect("/users/register");
                  });
              }
            });
          }
        });
      }
    });
  }
};

module.exports = {
  getLogin,
  getRegister,
  postLogin,
  postRegister,
};
