const mongoose = require("mongoose");
const { Schema } = mongoose;

const JobApplicantsSchema = new Schema({
  seeker_id: {type: Schema.Types.ObjectId, ref:"User"},
  status: String,
  description: String,
  applied_date: String
});

module.exports = JobApplicantsSchema;
