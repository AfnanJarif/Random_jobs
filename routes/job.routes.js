const express = require("express");
const router = express.Router();
const {
  ensureAuthenticated, 
  isLoggedIn 
} = require("./../middlewares/auth.middleware");
const isRecruiter = require("./../middlewares/isRecruiter.middleware");
const {
  getJobCreation,
  postJobCreation,
  getJob,
  jobRequests,
  jobAssigned,
  jobDone
} = require("./../controllers/jobs.controller");

router.get("/jobCreation", ensureAuthenticated, isRecruiter, getJobCreation);
router.post("/jobCreation", postJobCreation);
router.get("/", getJob);
router.post("/jobRequests", jobRequests);
router.post("/jobAssigned", jobAssigned);
router.post("/jobDone", jobDone);

module.exports = router;