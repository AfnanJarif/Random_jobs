const express = require("express");
const router = express.Router();
const {
    ensureAuthenticated, 
    isLoggedIn 
} = require("./../middlewares/auth.middleware");
const getDashboard  = require("./../controllers/users.controller");

router.get("/dashboard", ensureAuthenticated, getDashboard);

module.exports = router;