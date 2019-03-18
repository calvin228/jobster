const mongoose = require("mongoose");
const { Schema } = mongoose;

const userDetailSchema = new Schema({
  dob: String,
  gender: String,
  location: String,
  quickhire: String,
  hire_allow: Boolean,
  phone_number: String,
  address: String,
  profile_image: String,
  resume: String,
});

module.exports = userDetailSchema;
