const express = require("express");
const router = express.Router();

const {
    postverifyotp
} = require("../controllers/otp.controller");

router.post("/verifyotp", postverifyotp);
module.exports = router;