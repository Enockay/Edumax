const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    message: { type: String, required: true },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
});

module.exports = mongoose.model('Notification', notificationSchema);
