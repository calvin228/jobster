const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    sender: String,
    message: String,
    dateReceived: {type: Date, default: Date.now()}
})

mongoose.model("notification", notificationSchema);