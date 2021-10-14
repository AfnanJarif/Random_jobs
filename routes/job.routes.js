const express = require("express");
const router = express.Router();

const mongoose = require('mongoose');
const crypto = require('crypto');
const multer = require('multer');
const Grid = require('gridfs-stream');
const {GridFsStorage} = require('multer-gridfs-storage');
const path = require('path');


const {
  ensureAuthenticated, 
  isLoggedIn 
} = require("./../middlewares/auth.middleware");
const {
  isRecruiter,
  isRecruiterdashboard, 
} = require("./../middlewares/isRecruiter.middleware");
const {
  getJobCreation,
  postJobCreation,
  getJob,
  jobRequests,
  jobAssigned,
  jobDone
} = require("./../controllers/jobs.controller");


const conn = mongoose.createConnection(process.env.MongoURI);

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

const storage = new GridFsStorage({
    url: process.env.MongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                console.log("1");
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });


router.get("/jobcreation", ensureAuthenticated, isRecruiter, getJobCreation);
router.post("/jobcreation", ensureAuthenticated, isRecruiter, upload.single('file'), postJobCreation);
router.get("/recruiterdashboard",ensureAuthenticated, isRecruiter, getJob);
router.post("/jobRequests", jobRequests);
router.post("/jobAssigned", jobAssigned);
router.post("/jobDone", jobDone);

module.exports = router;