const mongoose = require('mongoose');

// Define a schema for storing the PDF in MongoDB
const reportSchema = new mongoose.Schema({
  studentName: String,
  stream: String,
  term: String,
  year: String,
  examType: String,
  pdf: Buffer
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;

