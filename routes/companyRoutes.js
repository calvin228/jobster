const checkRoles = require("../middleware/checkRoles");
const requireEmployer = require("../middleware/requireEmployer");
const Jobs = require("../models/Jobs");
const User = require("../models/User");
const Quickhire = require("../models/Quickhire");
const moment = require("moment");

module.exports = app => {
  app.get("/company", requireEmployer, (req, res) => {
    res.render("homeCompany", { user: req.user, nav_active: "Home" });
  });
  app.get("/company/createjob", checkRoles("employer"), (req, res) => {
    res.render("createJob", {
      user: req.user,
      message: req.flash("error"),
      nav_active: "Create Job"
    });
  });
  app.post("/company/createjob", checkRoles("employer"), (req, res) => {
    const {
      job_title,
      salary,
      location,
      job_type,
      description,
      requirements
    } = req.body;

    const newJob = new Jobs({
      job_title,
      salary,
      location,
      company: req.user.id,
      description,
      job_type,
      requirements
    });

    Jobs.create(newJob, (err, job) => {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("/company/createjob");
      }

      return res.redirect("/company/jobstatus");
    });
  });

  app.get("/company/jobstatus", checkRoles("employer"), (req, res) => {
    Jobs.find({ company: req.user.id }, (err, jobs) => {
      if (err) {
        return err.message;
      }
      return res.render("jobStatus", {
        user: req.user,
        jobdata: jobs,
        nav_active: "Job Status"
      });
    });
  });

  app.get("/company/jobstatus/:id", checkRoles("employer"), (req, res) => {
    const { id } = req.params;
    Jobs.findById(id)
      .populate("seeker.seeker_id")
      .then(job => {
        // res.send(job);
        res.render("jobStatusDetail", {
          user: req.user,
          jobdata: job,
          nav_active: "Job Status"
        });
      });
  });

  app.post(
    "/company/jobstatus/:id/:applicant_id",
    checkRoles("employer"),
    (req, res) => {
      const { id, applicant_id } = req.params;
      const { decision, description } = req.body;
      Jobs.updateOne(
        {
          _id: id,
          seeker: {
            $elemMatch: {
              _id: applicant_id
            }
          }
        },
        {
          $set: {
            "seeker.$.status": decision,
            "seeker.$.description": description
          }
        }
      ).then(job => {
        res.redirect(`/company/jobstatus/${id}`);
      });
    }
  );
};
