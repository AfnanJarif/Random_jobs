const getDashboard = (req, res) => {
    res.render("users/dashboard.ejs", { req: req });
}

module.exports = getDashboard;