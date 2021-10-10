
const insertProfilePic = (req, res) => {
  if(req.user.profilepic != null){
    gfs.remove({ filename: req.user.profilepic, root: 'uploads' }, (err, gridStore) => {
      if (err) {
        gfs.remove({ filename: req.file.filename, root: 'uploads' }, (err, gridStore) => {
          if (err) {
            errors.push("Can't delete the profile picture which has been uploaded now!");
            req.flash("errors", errors);
            res.redirect("/profilepic");
          }
        });
        errors.push("Can't delete current Profile Picture");
        req.flash("errors", errors);
        res.redirect("/profilepic");
      }
    });
  }
  
  User.findOne({_id:req.user._id})
  .then((user) => {
    user.profilepic = req.file.filename;
    user
    .save()
    .then(() => {
      errors.push("Profile Picture has been uploaded succfessfully!");
      req.flash("errors", errors);
      res.redirect("/profile");
    })
    .catch(() => {
      req.logout();
      errors.push("User doesn't exits!");
      req.flash("errors", errors);
      res.redirect("/signin");
    });
  })
}


const insertCV = (req, res) => {
  const errors = [];
  if(req.user.cv != null){
    gfs.remove({ filename: req.user.cv, root: 'uploads' }, (err, gridStore) => {
      if (err) {
        gfs.remove({ filename: req.file.filename, root: 'uploads' }, (err, gridStore) => {
          if (err) {
            errors.push("Can't delete the CV has been uploaded now!");
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
 
  User.findOne({_id: req.user._id})
  .then((user) => {
    user.cv = req.file.filename;
    user
    .save()
    .then(() => {
      errors.push("CV has been uploaded succfessfully!");
      req.flash("errors", errors);
      res.redirect("/profile");
    })
  })
};

const getCV = (req,res) => {
  gfs.files.findOne({ _id: req.user.cv }, (err, file) => {
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
  //uploadProfilePic,
  //uploadCV,
  //insertProfilePic,
  //insertCV,
  //getCV,  
};