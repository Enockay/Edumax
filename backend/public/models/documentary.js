const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  admissionNumber: String,
  fullName: String,
  uniqueItem: String,
});

const documentarySchema = new Schema({
  teacherName :String,
  documentaryName :String,
  stream: String,
  students: [studentSchema],
});

const documentary = mongoose.model('Documentaris', documentarySchema);
 
module.exports = documentary;