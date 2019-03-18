const mongoose = require("mongoose");
const { Schema } = mongoose;

const QuickhireRequestSchema = new Schema({
  seeker_id: {type: Schema.Types.ObjectId, ref:"User"},
  status: String,
  created_at: String
});

module.exports = QuickhireRequestSchema;
