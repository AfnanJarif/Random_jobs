const User = require("../models/User.model");
const sha1 = require("sha1");

const getverifyotp = (req, res) => {
    res.render("auth/verifyotp.ejs", { error: req.flash("error")});
}

const postverifyotp = (req, res) => {
    const otp = req.body;
    const encodeotp = sha1(otp);
    User.findOne({_id : req.user._id}).then((user) => {
        if(user){
            const userotp = user.otpcode;
            if(encodeotp == userotp){
                res.redirect("/dashboard");
            } else{
                res.redirect("/signin");
            }
        }
    }); 
}