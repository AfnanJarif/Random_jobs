const express = require("express");
const router = express.Router();
const {
    ensureAuthenticated, 
    isLoggedIn 
} = require("./../middlewares/auth.middleware");
const getDashboard  = require("./../controllers/users.controller");
//const uploadFile = require("../controllers/upload.controller");


router.get("/dashboard", ensureAuthenticated, getDashboard);
//router.post("/upload", uploadFile);


module.exports = router;