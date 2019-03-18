const User = require("../models/User");

module.exports = (req, res, next) => {
  User.findOne({ username: req.body.username }).exec((err, user) => {
    if (err) {
      return res.send(err);
    } else if (req.user){
      
      if (req.user.role === "seeker"){
        return res.redirect('/');
      }
    }
    next();
  });
};
