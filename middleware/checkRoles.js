module.exports = roles => (req, res, next) => {
  if (!req.user) {
    return res.redirect("/company");
  } else if (req.user.role !== roles) {
    switch (req.user.role) {
      case "seeker":
        return res.redirect("/");
      case "employer":
        return res.redirect("/company");
      default:
        return res.redirect("/");
    }
  }
  next();
};
