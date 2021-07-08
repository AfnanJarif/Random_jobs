const Job = require('../models/Job.model')

const getJobCreation = (req, res) => {
    res.render("jobs/jobCreation.ejs", { error: req.flash("error") });
}

const postJobCreation = (req, res) => {
    const { name, category, recruiterType, recruiterName, payment } = req.body;

    const newJob = new Job({
        name,
        category,
        recruiterType,
        recruiterName,
        payment,
      });
      newJob
        .save()
        .then(() => {
          res.redirect("/");
        })
        .catch(() => {
          errors.push("Saving Job to the daatabase failed!");
          req.flash("errors", errors);
          res.redirect("/job");
        });
}
