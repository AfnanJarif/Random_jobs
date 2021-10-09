require("dotenv").config();
const User = require("../model/User.model");
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const num = require("num");

function between(min, max) {  
  return Math.floor(
      Math.random() * (max - min + 1) + min
  )
}

const profilePicStorage = new GridFsStorage({
  url: process.env.MongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        } 
        const filename = req.user._id + file.originalname + num.toString(between(1000000000, 9999999999));
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const uploadProfilePic = multer({ profilePicStorage });

const cvStorage = new GridFsStorage({
  url: process.env.MongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        } 
        const filename = req.user._id + file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const uploadCV = multer({ cvStorage });

const conn = mongoose.createConnection(process.env.MongoURI);
let gfs;

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});


const insertProfilePic = (req, res) => {
  if(req.user.profilepic != null){
    gfs.remove({ filename: req.user.profilepic, root: 'uploads' }, (err, gridStore) => {
      if (err) {
        gfs.remove({ filename: req.file.filename, root: 'uploads' }, (err, gridStore) => {
          if (err) {
            errors.push("Can't delete current Profile Picture");
            req.flash("errors", errors);
            res.redirect("/uploadprofilepic");
          }
          errors.push("Can't delete previous Profile Picture");
          req.flash("errors", errors);
          res.redirect("/uploadprofilepic");
        });
      }
    });
  }
  
  User.findOne({email : email})
  .then((user) => {
    user.profilepic = req.file.filename;
  })
  .save()
  .catch((err) => {
    if (err){
      gfs.remove({ filename: req.file.filename, root: 'uploads' }, (err, gridStore) => {
        if (err) {
          errors.push("Can't delete current Profile Picture(user save part)");
          req.flash("errors", errors);
          res.redirect("/uploadprofilepic");
        }
      });
      errors.push("Can't update user");
      req.flash("errors", errors);
      res.redirect("/uploadprofilepic");
    }
  })
};


const insertCV = (req, res) => {
  if(req.user.cv != null){
    gfs.remove({ filename: req.user.cv, root: 'uploads' }, (err, gridStore) => {
      if (err) {
        gfs.remove({ filename: req.file.filename, root: 'uploads' }, (err, gridStore) => {
          if (err) {
            errors.push("Can't delete current CV");
            req.flash("errors", errors);
            res.redirect("/uploadCV");
          }
        });
  
        errors.push("Can't delete previous CV");
        req.flash("errors", errors);
        res.redirect("/uploadCV");
      }
    });
  }
 
  User.findOne({email : email})
  .then((user) => {
    user.cv = req.file.filename;
  })
  .save()
  .catch((err) => {
    if (err){
      gfs.remove({ filename: req.file.filename, root: 'uploads' }, (err, gridStore) => {
        if (err) {
          errors.push("Can't delete current CV(user save part)");
          req.flash("errors", errors);
          res.redirect("/uploadCV");
        }
      });
      errors.push("Can't update user");
      req.flash("errors", errors);
      res.redirect("/uploadCV");
    }
  })
};

const getCV = (req,res) => {
  gfs.files.findOne({ filename: req.user.cv }, (err, file) => {
    if (!file || file.length === 0) {
      errors.push("CV has not been uploaded yet");
      req.flash("errors", errors);
      res.redirect("/dashboard");
    }
   else{
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    }
  });
}

module.exports = {
  uploadProfilePic,
  uploadCV,
  insertProfilePic,
  insertCV,
  getCV,  
};