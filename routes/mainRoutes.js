const requireLogin = require("../middleware/requireLogin");
const cloudinary = require("cloudinary");
const location_list = require("../public/json/kota-kabupaten.json");
const User = require("../models/User");
const forbidEmployer = require("../middleware/forbidEmployer");
const forbidSeeker = require("../middleware/forbidSeeker");

module.exports = (app, upload) => {
  app.get("/", forbidEmployer, (req, res) => {
    res.render("home", { user: req.user, nav_active: "Home" });
  });

  app.get("/about", (req, res) => {
    res.render("about", { user: req.user, nav_active: "About" });
  });

  // need to add ID on params
  app.get("/my-profile", forbidEmployer, requireLogin, (req, res) => {
    res.render("myProfile", { user: req.user, nav_active: "" });
  });

  app.get("/my-profile/edit", forbidEmployer, requireLogin, (req, res) => {
    res.render("editProfile", {
      user: req.user,
      location_list,
      nav_active: ""
    });
  });

  app.get("/profile/:id", forbidSeeker, requireLogin, (req, res) => {
    const { id } = req.params;
    User.findById({ _id: id }).then(profile => {
      console.log(req.user);
      res.render("profile", {
        user: req.user,
        profile: profile,
        nav_active: ""
      });
    });
  });

  app.post(
    "/my-profile/edit",
    requireLogin,
    upload.single("image"),
    async (req, res) => {
      const { dob, phone_number, hire_allow, location, quickhire } = req.body;
      console.log(req.body);
      let userData;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        userData = {
          dob,
          phone_number,
          hire_allow,
          location,
          quickhire,
          profile_image: result.secure_url
        };
      } else {
        userData = {
          dob,
          phone_number,
          hire_allow,
          location,
          quickhire,
          profile_image: req.user.userDetail.profile_image
        };
      }

      User.updateOne(
        { _id: req.user.id },
        {
          "userDetail.dob": userData.dob,
          "userDetail.phone_number": userData.phone_number,
          "userDetail.hire_allow": userData.hire_allow,
          "userDetail.location": userData.location,
          "userDetail.profile_image": userData.profile_image,
          "userDetail.quickhire": userData.quickhire
        }
      ).then(() => {
        res.redirect("/my-profile");
      });
    }
  );

  app.post(
    "/upload-cv",
    requireLogin,
    upload.single("pdf"),
    async (req, res) => {
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        try {
          User.updateOne(
            { _id: req.user.id },
            {
              "userDetail.resume": result.secure_url
            }
          ).then(() => {
            res.redirect("/my-profile");
          });
        } catch (err) {
          req.flash("error", err.message);
          res.redirect("/my-profile");
        }
      }
    }
  );
};
