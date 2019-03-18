module.exports = (req, res, next) => {
  if (!req.user) {
    
    req.session.redirectTo = req.originalUrl;
    req.flash("error", "Login is required");
    return res.redirect("/login", 401, { message: req.flash("error") });
  }
  next();
};