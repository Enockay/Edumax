const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Unit schema
const UnitSchema = new Schema({
  name: {
    type: String,
    enum: ["Math", "Kisw", "Eng", "Chem", "Phy", "Bio", "Cre", "Agri", "Busn", "Hist", "Geog"],
    required: true
  }
});

// Define the TeachingSubject schema
const TeachingSubjectSchema = new Schema({
  stream: {
    type: String,
    enum: ["Form 4 East", "Form 4 West", "Form 3 East", "Form 3 West", "Form 2 East", "Form 2 West", "Form 1 East", "Form 1 West"],
    required: true
  },
  units: [UnitSchema]
});

// Define the Classes schema
const ClassesSchema = new Schema({
  year: {
    type: String,
    required: true,
    match: /^[0-9]{4}$/
  },
  term: {
    type: String,
    enum: ["Term 1", "Term 2", "Term 3"],
    required: true
  },
  teachingSubjects: [TeachingSubjectSchema]
});

// Create the Classes model
const Classes = mongoose.model('Classes', ClassesSchema);

module.exports = Classes;
