const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  subject: String,
  teacherName: String,
  className: String,
  fileUrl: String,
  notification: String,
  uploadedAt: { type: Date, default: Date.now },
  printed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Exam', examSchema);
