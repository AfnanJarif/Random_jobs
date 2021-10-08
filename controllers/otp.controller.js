const User = require("../models/User.model");
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
                } else{
                    errors.push("Code doesn't match! Try again.");
                    req.flash("errors", errors);
                    res.redirect("/signup");
                }
            } 
            else {
                errors.push("Timed out for inserting the code, Please try again");
                req.flash("errors", errors);
                res.redirect("/signup");
            }
        }
    }); 
}

module.exports = {
    postverifyotp
}