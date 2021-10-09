const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const sha1 = require("sha1");
const num = require("num");

const postverifyotp = (req, res) => {
    const {
        otp, 
        email
    } = req.body;

    const stringOTP = num.toString(otp);
    const encodeotp = sha1(stringOTP);
    User.findOne({email : email}).then((user) => {
        if(user){
            const errors = [];
            const userotp = user.otpcode;
            const diff = new Date().getTime() - user.otpcodetime;

            if(diff < 0){
                if(encodeotp == userotp){
                    errors.push("Your account have been created Successfully. Please Sign In!");
                    req.flash("errors", errors);
                    res.redirect("/signin");
                } else {
                    User.deleteOne({ email: email })
                    .catch((err) => {
                        if(err){
                            let error = "Something in the server is wrong, Please try one more time.";
                            console.log(error);
                            res.redirect("/signup");
                        }
                    });

                    errors.push("Code doesn't match! Try again.");
                    req.flash("errors", errors);
                    res.redirect("/signup");
                }
            } 
            else {
                User.deleteOne({ email: email })
                .catch((err) => {
                    if(err){
                        let error = "Something in the server is wrong, Please try one more time.";
                        console.log(error);
                        res.redirect("/signup");
                    }
                });

                errors.push("Timed out for inserting the code, Please try again");
                req.flash("errors", errors);
                res.redirect("/signup");
            }
        }
    }); 
}

const postverifyotppass = (req, res) =>{
    const {
        otp,
        password, 
    } = req.body;

    const stringOTP = num.toString(otp);
    const encodeotp = sha1(stringOTP);
    User.findOne({_id : req.user._id}).then((user) => {
        if(user){
            const errors = [];
            const userotp = user.otpcode;
            const diff = new Date().getTime() - user.otpcodetime;

            if(diff < 0){
                if(encodeotp == userotp){
                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) {
                          errors.push(err);
                          req.flash("errors", errors);
                          res.redirect("/resetpassword");
                        } else {
                          bcrypt.hash(password, salt, (err, hash) => {
                            if (err) {
                              errors.push(err);
                              req.flash("errors", errors);
                              res.redirect("/resetpassword");
                            } else {
                              User.findOne({_id: req.user._id})
                              .then((user)=>{
                                user.password = hash;
                                user
                                .save()
                              })
                              .catch((err) =>{
                                  if(err){
                                    errors.push("Error in saving the new password!");
                                    req.flash("errors", errors);
                                    res.redirect("/resetpassword");
                                  }
                              });

                              req.logout();
                              errors.push("Your password has been chaged Successfully. Please Sign In again!");
                              req.flash("errors", errors);
                              res.redirect("/signin");
                            }
                          });
                        }
                    });
                } else {
                    errors.push("Code doesn't match! Try again.");
                    req.flash("errors", errors);
                    res.redirect("/resetpassword");
                }
            } 
            else {
                errors.push("Timed out for inserting the code, Please try again");
                req.flash("errors", errors);
                res.redirect("/resetpassword");
            }
        }
    }); 
}

const postverifyotpemail = (req, res) => {
    const {
        otp,
        email,
    } = req.body;

    const stringOTP = num.toString(otp);
    const encodeotp = sha1(stringOTP);
    User.findOne({_id : req.user._id}).then((user) => {
        if(user){
            const errors = [];
            const userotp = user.otpcode;
            const diff = new Date().getTime() - user.otpcodetime;

            if(diff < 0){
                if(encodeotp == userotp){
                    User.findOne({_id: req.user._id})
                    .then((user)=>{
                        user.email = email;
                        user
                        .save()
                        .catch((err) =>{
                            errors.push("Error in saving the new email!");
                            req.flash("errors", errors);
                            res.redirect("/resetemail");
                        })
                    })                   
                    .catch((err) =>{
                        if(err){
                        
                        }
                    });

                    req.logout();
                    errors.push("Your email has been chaged Successfully. Please Sign In again!");
                    req.flash("errors", errors);
                    res.redirect("/signin");
                } else {
                    errors.push("Code doesn't match! Try again.");
                    req.flash("errors", errors);
                    res.redirect("/resetemail");
                }
            } 
            else {
                errors.push("Timed out for inserting the code, Please try again");
                req.flash("errors", errors);
                res.redirect("/resetemail");
            }
        }
    }); 
}


module.exports = {
    postverifyotp,
    postverifyotppass,
    postverifyotpemail,
}