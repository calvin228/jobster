const Jobs = require("../models/Jobs");
const requireLogin = require("../middleware/requireLogin");
const moment = require('moment');

module.exports = app => {
  //TODO : Protect All Routes in this file
  app.get("/jobs", (req, res) => {
    let jobs = "";
    if (req.query.search || req.query.location){
      const job_title = new RegExp(escapeRegex(req.query.search), 'gi');
      const location = new RegExp(escapeRegex(req.query.location), 'gi');
      jobs = Jobs.find({$and: [{job_title}, {location}]}).populate("company");
      // better and / or? 
    } else {
      jobs = Jobs.find({}).populate("company");
    }
    
    jobs.then(jobs => {
      res.render("jobs", { user: req.user, jobdata: jobs , nav_active: "Jobs"});
    });
  });

  app.get("/jobs/:id", requireLogin, (req, res) => {
    const { id } = req.params;
    Jobs.findById(id)
      .populate("company", ["name", "companyDetail"]) // TODO : maybe this should be used on company
      .then(job => {
        // res.send(job);
        res.render("jobDetail", { user: req.user, jobdata: job , nav_active: "Jobs"});
      });
  });

  app.post("/jobs/:id", (req, res) => {
    const { id } = req.params;
    Jobs.updateOne(
      { _id: id },
      { $push: { seeker: { seeker_id: req.user.id, status: "Applied", description: "", applied_date: moment(Date.now()).format("DD-MM-YYYY")} } }
    ).then(() => {
      res.redirect(`/jobs/${id}`);
    });
  });

  app.get("/applied-jobs", requireLogin, (req, res) => {
    Jobs.find({ "seeker.seeker_id": req.user.id })
    .populate("company")
    .then(jobs => {
      res.render("appliedJobs", { user: req.user, jobs, nav_active: ""});
    });
  });

};

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}