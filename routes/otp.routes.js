const express = require("express");
const router = express.Router();

const {
    postverifyotp,
    postverifyotppass,
    postverifyotpemail,
} = require("../controllers/otp.controller");

router.post("/verifyotp", postverifyotp);
router.post("/verifyotppass", postverifyotppass);
router.post("/verifyotpemail", postverifyotpemail);
module.exports = router;