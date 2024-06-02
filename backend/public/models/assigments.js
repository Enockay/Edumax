const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  week: { type: Number, required: true },
  className: { type: String, required: true },
  subject: { type: String, required: true },
  assignmentText: { type: String, required: true },
  teacherName: { type: String, required: true } // Add teacher's name
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
