const mongoose = require("mongoose");
const { Schema } = mongoose;

const companyDetailSchema = new Schema({
  description: String,
  address: String,
  territorial: String,
  image: String,
  phone_number: String,
});

module.exports = companyDetailSchema;
