const User = require("../models/User.model");
const nodemailer = require("nodemailer");
const sha1 = require("sha1");

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

const otp = between(1000, 9999);
const otpcode = sha1(otp);

function getotp() {

    User.findOne({_id: req.user._id})
    .then((user) => {
        user.otpcode = otpcode;
        user
        .save();
    })
    .catch((err) => {
        console.log(err);
    });
    
    const options = {
        from: process.env.MailAddress, 
        to: req.user.email,
        subject: "Verify your Email, RandomJobs",
        html: "<h2>Hi "+`${newUser.name}`+"!\nPlease insert the below code for your email verification:\n"+`${otp}`,
    }

    transporter.sendMail(options, (err, info) => {
        if(err){
            errors.push("Your Provided Email doesn't exists, Please Sign Up again!");
            req.flash("errors", errors);

            contestTeam.deleteOne({ _id: newUser._id })
            .catch((err) => {
                if(err){
                    let error = "Something in the server is wrong, Please try one more time.";
                    console.log(error);
                    res.redirect("/signin");
                }
            });
            res.redirect("/signup");
        } else {
            res.redirect("/verifyotp");
        }
    });
}

const isVerified = (req, res, next) => {
    if(req.user.emailVerified == true){
      next();
    } else {
      getotp();
    }
  };

module.exports = {
    isVerified
};