const express = require("express");
const router = express.Router();

const {
    ensureAuthenticated
} = require("./../middlewares/auth.middleware");


const {
    getDashboard,
    getprofile,
    geteditprofile,
    geteditdescription,
    posteditprofile,
    posteditdescription,  
} = require("./../controllers/users.controller");

router.get("/dashboard", ensureAuthenticated, getDashboard);
router.get("/profile", ensureAuthenticated, getprofile);
router.get("/updateprofile", ensureAuthenticated, geteditprofile);
router.get("/updatedescription", ensureAuthenticated, geteditdescription);
router.post("/updateprofile", ensureAuthenticated, posteditprofile);
router.post("/updatedescription", ensureAuthenticated, posteditdescription);
module.exports = router;