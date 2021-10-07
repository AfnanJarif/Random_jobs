const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const getLogin = (req, res) => {
  res.render("auth/signin.ejs", { error: req.flash("error"), req: req });
};

const postLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/signin",
    failureFlash: true,
  })(req, res, next);
};

const getRegister = (req, res) => {
  res.render("auth/signup.ejs", { errors: req.flash("errors"), req: req });
};

const postRegister = (req, res) => {
  const { 
    name, 
    email, 
    usertype, 
    phone, 
    age, 
    thana,
    district,
    password, 
    confirm_password,
    userOccupation
   } = req.body;


  //Data Validation
  const errors = [];
  if (!name || !email || !password || !confirm_password || !usertype || !phone || !userOccupation || !thana || !district) {
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
    res.send(errors);
    res.redirect("/signin");
  } else {
    //Create New User
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push("User already exists with this email!");
        req.flash("errors", errors);
        res.redirect("/signup");
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            errors.push(err);
            req.flash("errors", errors);
            res.redirect("/signup");
          } else {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) {
                errors.push(err);
                req.flash("errors", errors);
                res.redirect("/signup");
              } else {
                const newUser = new User({
                  address: {
                    thana: thana, 
                    district: district,
                  },
                  name: name,
                  email: email,
                  password: hash,
                  usertype: usertype, 
                  phone: phone, 
                  userOccupation: userOccupation,
                  age: age 
                });
                newUser
                  .save()
                  .then(() => res.redirect("/signin"))
                  .catch(() => {
                    errors.push("Saving User to the daatabase failed!");
                    req.flash("errors", errors);
                    res.redirect("/signup");
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
