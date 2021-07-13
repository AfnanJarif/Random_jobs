const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("./../middlewares/auth.middleware");



router.get("/", (req, res) =>{
  res.send("This is Home Page");
});

module.exports = router;
