const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose')
const { Schema } = mongoose;
const userDetailSchema = require('./UserDetail');
const companyDetailSchema = require("./CompanyDetail");

const userSchema = new Schema({
  name: String,
  username: {
    type: String,
    unique: true,
    lowercase: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  role: String,
  userDetail: userDetailSchema,
  companyDetail: companyDetailSchema
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
