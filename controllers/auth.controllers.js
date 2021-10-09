require("dotenv").config();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const nodemailer = require("nodemailer");
const sha1 = require("sha1");
const num = require("num");

function between(min, max) {  
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

const transporter = nodemailer.createTransport({
    service : "Gmail",
    auth : {
        user: process.env.MailAddress,
        pass: process.env.PASS
    }
});



//Authentication
const getLogin = (req, res) => {
  res.render("auth/signin.ejs", { error: req.flash("errors"), req: req });
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
    res.redirect("/signup");
  } else {

    //Checking if the user exists
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push("User already exists with this email!");
        req.flash("errors", errors);
        res.redirect("/signup");
      } else {

        //hashing password
        const otp = between(1000, 9999);
        const stringOTP = num.toString(otp);
        const otpcode = sha1(stringOTP);

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
                
                //constructing new user
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
                  age: age,
                  otpcode: otpcode,
                  otpcodetime: new Date().getTime() + 300000,
                });
                newUser
                  .save()
                  .then(() => {
                    
                    const options = {
                      from: process.env.MailAddress, 
                      to: newUser.email,
                      subject: "Verify your Email, RandomJobs",
                      html: "<h2>Hi "+`${newUser.name}`+"!</h2><br>Please insert the below code for your email verification: <b>"+`${otp}`+"</b>",
                    }
              
                    transporter.sendMail(options, (err, info) => {
                      if(err){
                        errors.push("Your Provided Email doesn't exists, Please Sign Up again!");
                        req.flash("errors", errors);
            
                        User.deleteOne({ _id: newUser._id })
                        .catch((err) => {
                            if(err){
                                let error = "Something in the server is wrong, Please try one more time.";
                                console.log(error);
                                res.redirect("/signup");
                            }
                        });
                        res.redirect("/signup");
                      } else {
                        res.render("otp/verifyotp.ejs", { email: email, req : req,error: req.flash("errors")});
                      }
                    });
                  })
                  .catch(() => {
                    errors.push("Saving User to the database failed!");
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

const getresetpassword = (req, res) => {
  res.render("auth/resetpassword.ejs", { errors: req.flash("errors"), req: req });
}

const postresetpassword = (req, res) => {
  
  const {
    new_password,
    confirm_password,
  } = req.body

  const errors = [];
  
  if (new_password.length < 6) {
    errors.push("Password must be at least 6 characters!");
  }
  if (new_password !== confirm_password) {
    errors.push("Passwords do not match!");
  }


  if (errors.length > 0) {
    req.flash("errors", errors);
    res.redirect(req.get('referer'));
  } else { 
    const otp = between(1000, 9999);
    const stringOTP = num.toString(otp);
    const otpcode = sha1(stringOTP);

    User.findOne({_id: req.user._id})
    .then((user)=>{
      user.otpcode = otpcode;
      user.otpcodetime = new Date().getTime() + 300000;
      user
      .save()
    });

    const options = {
      from: process.env.MailAddress, 
      to: req.user.email,
      subject: "Verify your Email, RandomJobs",
      html: "<h2>Hi "+`${req.user.name}`+"!</h2><br>Please insert the below code for your email verification: <b>"+`${otp}`+"</b>",
    }

    transporter.sendMail(options, (err, info) => {
      if(err){
        errors.push("Something is wrong, Please try again!");
        req.flash("errors", errors);
        res.redirect("/resetpassword");
      } else {
        errors.push("Please verify your email!");
        req.flash("errors", errors);
        res.render("otp/verifyotppass.ejs", { password:new_password, req : req,error: req.flash("errors")});
      } 
    });   
  }
}

const getresetemail = (req, res) => {
  res.render("auth/resetemail.ejs", { errors: req.flash("errors"), req: req });
}

const postresetemail = (req, res) => {
  const errors = [];
  const {
    new_email,
    confirm_email,
  } = req.body

  if (new_email !== confirm_email) {
    errors.push("Emails do not match!");
  }

  if (errors.length > 0) {
    req.flash("errors", errors);
    res.redirect("/resetemail");
  } else { 

    const otp = between(1000, 9999);
    const stringOTP = num.toString(otp);
    const otpcode = sha1(stringOTP);

    User.findOne({_id: req.user._id})
    .then((user)=>{
      user.otpcode = otpcode;
      user.otpcodetime = new Date().getTime() + 300000;
      user
      .save();
    });

    const options = {
      from: process.env.MailAddress, 
      to: new_email,
      subject: "Verify your Email, RandomJobs",
      html: "<h2>Hi "+`${req.user.name}`+"!</h2><br>Please insert the below code for your email verification: <b>"+`${otp}`+"</b>",
    }

    transporter.sendMail(options, (err, info) => {
      if(err){
        errors.push("Something is wrong, Please try again!");
        req.flash("errors", errors);
        res.redirect("/resetpassword");
      } else {
        let errors = "Please verify your email!";
        req.flash("errors", errors);
        res.render("otp/verifyotpemail.ejs", { email:new_email, req : req,error: req.flash("errors")});
      }
    });   
  }
}


module.exports = {
  getLogin,
  getRegister,
  postLogin,
  postRegister,
  getresetpassword,
  postresetpassword,
  getresetemail,
  postresetemail,
};
