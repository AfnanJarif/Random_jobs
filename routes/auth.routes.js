const express = require("express");
const router = express.Router();
const {
  ensureAuthenticated,
  isLoggedIn
} = require("./../middlewares/auth.middleware");

const {
  getLogin,
  getRegister,
  postLogin,
  postRegister,
} = require("../controllers/auth.controllers");

router.get("/signin", isLoggedIn, getLogin);
router.post("/signin", isLoggedIn, postLogin);
router.get("/signup", isLoggedIn, getRegister);
router.post("/signup", isLoggedIn, postRegister);
router.get("/signout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
