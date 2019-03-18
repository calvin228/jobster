const User = require("../models/User");

module.exports = email => async (req, res, next) => {
    const user = await User.find({email: email})
    if (user.length > 0){
        req.flash("error", "Email is already exist");
        res.redirect('/register/company');
    }
    next();
  };
  