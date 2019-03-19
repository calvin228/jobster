module.exports = (req, res, next) => {
  if (!req.user) {
    next();
  } else if (req.user.role === "employer") {
    return res.redirect("/company");
  } 
  next();
};
