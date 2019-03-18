const checkRoles = require("../middleware/checkRoles");
const requireEmployer = require("../middleware/requireEmployer");
const User = require("../models/User");
const Quickhire = require("../models/Quickhire");
const moment = require("moment");
const requireLogin = require("../middleware/requireLogin");


module.exports = app => {
  app.get("/quickhire-alert", requireLogin, (req, res) => {
    Quickhire.find({ "request_list.seeker_id": req.user.id })
      .populate("company")
      .then(quickhire => {
        res.render("quickhireAlert", { user: req.user, quickhire, nav_active: "" });
      });
  });

  app.get("/quickhire-alert/:id", requireLogin, (req, res) => {
    const { id } = req.params;
    Quickhire.findById(id)
      .populate("company")
      .then(quickhire => {
        res.render("quickhireAlertDetail", { user: req.user, quickhire, nav_active: "" });
      });
  });

  app.post(
    "/quickhire-alert/:id",
    requireLogin,
    checkRoles("seeker"),
    (req, res) => {
      const { id } = req.params;
      const { choice } = req.body;

      Quickhire.updateOne(
        {
          _id: id,
          request_list: {
            $elemMatch: {
              seeker_id: req.user.id
            }
          }
        },
        {
          $set: {
            "request_list.$.status": choice
          }
        }
      ).then(quickhire => {
        res.redirect(`/quickhire-alert/${id}`);
      });
    }
  );

  app.get("/company/quickhire", checkRoles("employer"), (req, res) => {
    Quickhire.find({ company: req.user.id }, (err, quickhire) => {
      if (err) {
        return err.message;
      }
      return res.render("myQuickhire", {
        user: req.user,
        quickhireData: quickhire,
        nav_active: "Quick Hire"
      });
    });
  });

  app.get("/company/quickhire/create", checkRoles("employer"), (req, res) => {
    res.render("quickhireCreate", {
      user: req.user,
      message: req.flash("error"),
      nav_active: "Quick Hire"
    });
  });

  app.post("/company/quickhire/create", checkRoles("employer"), (req, res) => {
    const {
      job_title,
      amount,
      location,
      description,
      time_unit,
      required_date
    } = req.body;

    const newQuickhire = new Quickhire({
      job_title,
      salary: { amount, time_unit },
      location,
      company: req.user.id,
      description,
      required_date,
      status: "Open",
      created_at: moment(Date.now()).format("DD-MM-YYYY")
    });

    Quickhire.create(newQuickhire, (err, job) => {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("/company/quickhire/create");
      }

      return res.redirect("/company/quickhire");
    });
  });

  app.get("/company/quickhire/:id", checkRoles("employer"), (req, res) => {
    const { id } = req.params;
    Quickhire.findById(id)
      .populate("request_list.seeker_id")
      .then(quickhire => {
        //   return res.send(quickhire)
        return res.render("quickhireDetail", {
          user: req.user,
          quickhire,
          message: req.flash("error"),
          nav_active: "Quick Hire"
        });
      });
  });

  app.get("/company/quickhire/:id/find", checkRoles("employer"), (req, res) => {
    const { id } = req.params;

    Quickhire.findOne({ _id: id })
      .then(async quickhire => {
        const user = await User.find({
          $and: [
            { role: "seeker" },
            { "userDetail.hire_allow": true },
            { "userDetail.quickhire": quickhire.job_title },
            { "userDetail.location": quickhire.location }
          ]
        }).exec();
        res.render("quickhireRequestList", {
          user: req.user,
          request_list: user,
          quickhire,
          nav_active: "Quick Hire"
        });
      })
      .catch(err => {
        res.send(err);
      });
  });

  app.post(
    "/company/quickhire/:id/request/:candidate_id",
    checkRoles("employer"),
    (req, res) => {
      const { id, candidate_id } = req.params;
      Quickhire.updateOne(
        { _id: id },
        {
          $push: {
            request_list: {
              seeker_id: candidate_id,
              status: "Waiting for response",
              created_at: moment(Date.now()).format("DD-MM-YYYY , hh:mm:ss a")
            }
          }
        }
      )
        .then(() => {
          res.redirect(`/company/quickhire/${id}`);
        })
        .catch(err => {
          req.flash("error", err.message);
          res.redirect(`/company/quickhire/${id}/find`);
        });
    }
  );
  app.get("/api/company/quickhire", (req, res) => {
    const { quickhire, location } = req.query;
    User.find({
      $and: [
        { role: "seeker" },
        { "userDetail.hire_allow": true },
        { "userDetail.quickhire": quickhire },
        { "userDetail.location": location }
      ]
    }).then(user => {
      res.json(user);
    });
  });

  // app.get('/company/quickhire/hire', (req, res) => {
  // const { job_title, date, salary } = req.query

  // })
};
