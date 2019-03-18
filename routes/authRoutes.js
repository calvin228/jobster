const User = require("../models/User");
const passport = require("passport");
const cloudinary = require("cloudinary");
const requireSeeker = require("../middleware/requireSeeker");
const requireEmployer = require("../middleware/requireEmployer");

const moment = require("moment");

module.exports = (app, upload) => {
  app.get("/login", (req, res) => {
    if (!req.user) {
      res.render("auth/login", { message: req.flash("error") });
    } else if (req.user.role === "seeker") {
      res.redirect("/");
    } else if (req.user.role === "employer") {
      res.redirect("/company");
    }
  });

  app.post(
    "/login/user",
    requireSeeker,
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true
    })
  );

  app.get("/register", (req, res) => {
    if (!req.user) {
      res.render("auth/register", { message: req.flash("error") });
    } else {
      res.redirect("/");
    }
  });

  app.post("/register", upload.single("image"), async (req, res) => {
    const {
      username,
      name,
      email,
      password,
      gender,
      location,
      dob,
      quickhire,
      phone_number,
      address
    } = req.body;

    const newDob = moment(dob).format("YYYY-MM-DD");
    let newUser;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      newUser = new User({
        username,
        name,
        email,
        role: "seeker",
        userDetail: {
          gender,
          location,
          dob: newDob,
          quickhire,
          phone_number,
          hire_allow: true,
          address,
          profile_image: result.secure_url,
          resume: null
        },
        companyDetail: null
      });
    } else {
      newUser = new User({
        username,
        name,
        email,
        role: "seeker",
        userDetail: {
          gender,
          location,
          dob: newDob,
          quickhire,
          phone_number,
          hire_allow: true,
          address,
          profile_image:
            "https://res.cloudinary.com/calvin228/image/upload/v1551672314/Portrait_Placeholder-300x300.png",
          resume: null
        },
        companyDetail: null
      });
    }
    try {
      await User.register(newUser, password);
      res.redirect("/");
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/register");
    }
  });

  app.get("/register/company", (req, res) => {
    res.render("auth/registerCompany", { message: req.flash("error") });
  });

  app.post("/register/company", upload.single("image"), async (req, res) => {
    const {
      username,
      name,
      address,
      territorial,
      description,
      email,
      phone_number,
      password
    } = req.body;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      const newUser = new User({
        username,
        name,
        email,
        role: "employer",
        userDetail: null,
        companyDetail: {
          address,
          territorial,
          description,
          image: result.secure_url,
          phone_number
        }
      });
      User.register(newUser, password, (err, user) => {
        if (err) {
          req.flash("error", err.message);
          return res.redirect("/register/company");
        }
        return res.redirect("/company");
      });
    } else {
      req.flash("error", "No profile image found");
      return res.redirect("/register/company");
    }
  });

  app.get("/login/company", (req, res) => {
    if (!req.user) {
      res.render("auth/loginCompany", { message: req.flash("error") });
    } else if (req.user.role === "seeker") {
      res.redirect("/");
    } else if (req.user.role === "employer") {
      res.redirect("/company");
    }
  });

  app.post(
    "/login/company",
    requireEmployer,
    passport.authenticate("local", {
      successRedirect: "/company",
      failureRedirect: "/login/company",
      failureFlash: true
    })
  );

  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });
};
