const mongoose = require("mongoose");
const QuickhireRequests = require('./QuickhireRequests');

const { Schema } = mongoose;

const quickhireSchema = new Schema({
    job_title: String,
    salary: {amount: Number, time_unit: String},
    location: String,
    company: { type: Schema.Types.ObjectId, ref: "User" },
    description: String,
    request_list: [QuickhireRequests],
    required_date: String,
    status: String,
    created_at: String
});


module.exports = mongoose.model("Quickhire", quickhireSchema);
