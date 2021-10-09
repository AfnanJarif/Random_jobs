require("dotenv").config();
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const conn = mongoose.createConnection(process.env.MongoURI);
let gfs;

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

const getDashboard = (req, res) => {
    const errors = [];
    res.render("users/dashboard.ejs", { req: req, user:req.user });
   
}

module.exports = getDashboard;