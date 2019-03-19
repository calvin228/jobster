module.exports = (req, res, next) => {
    if (!req.user) {
      next();
    } else if (req.user.role === "seeker") {
      return res.redirect("/");
    }
    next();
  };
  