const getDashboard = (req, res) => {
    res.render("users/dashboard.ejs", { req: req, user:req.user });
}

module.exports = getDashboard;