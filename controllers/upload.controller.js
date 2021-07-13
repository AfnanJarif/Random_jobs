const upload = require("../middleware/upload");
const User = require("../models/User.model");

const uploadFile = async (req, res) => {
  try {
    await upload(req, res);

    const errors = [];
    console.log(req.file);
    if (req.file == undefined) {
        errors.push("You must select a file.");
    }

    User.findOneAndUpdat(
        { _id: req.user._id },
        { image: req.file.filename },
        {
          new: true,
        }
      ).exec(async (error, user) => {
        if (error) return res.status(400).json({ message: error });
        if (course) {
          return res.json({ course: course });
        } else {
          return res.status(200).json({ message: "no course" });
        }
      });

    return res.send(`File has been uploaded.`);
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload image: ${error}`);
  }
};

module.exports = uploadFile;