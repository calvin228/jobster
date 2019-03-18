const mongoose = require("mongoose");
const { Schema } = mongoose;
const JobApplicantsSchema = require('./JobApplicants');

const JobSchema = new Schema({
  job_title: String,
  salary: Number,
  location: String,
  company: { type: Schema.Types.ObjectId, ref: "User" },
  job_type: String,
  description: String,
  requirements: String,
  seeker: [JobApplicantsSchema],
  posted_at: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model("Job",JobSchema);
