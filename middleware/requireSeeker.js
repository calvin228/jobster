const User = require("../models/User");

module.exports = (req, res, next) => {
  User.findOne({ username: req.body.username }).exec((err, user) => {
    
    if (err) {
      return res.send(err.message)
    } else if (user === null){
      req.flash("error", "No user found");
      return res.redirect('/login');
    } else if (user.role !== "seeker") {
      return res.redirect("/");
    } 
    next();
  });
};
