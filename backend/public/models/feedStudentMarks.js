const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: false
  },
  P1: {
    type: Number,
    required: false
  },
  P2: {
    type: Number,
    required: false
  },
  P3: {
    type: Number,
    required: false
  }
});

const feedStudentMarksSchema = new mongoose.Schema({
  studentAdmission: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  units: {
    Eng: { type: unitSchema, required: false },
    Kisw: { type: unitSchema, required: false },
    Maths: { type: unitSchema, required: false },
    Chem: { type: unitSchema, required: false },
    Bio: { type: unitSchema, required: false },
    Phy: { type: unitSchema, required: false },
    Agri: { type: unitSchema, required: false },
    Busn: { type: unitSchema, required: false },
    Hist: { type: unitSchema, required: false },
    Geo: { type: unitSchema, required: false },
    Cre: { type: unitSchema, required: false }
  },
  gender: {
    type: String,
    required: true
  },
  stream: {
    type: String,
    required: true
  },
  totalGrade : {
     type : String,
     required : false
  },
  classRank : {
    type : String,
    required : false
  },
  overallRank : {
  type : String,
  required : false
  }
});

const StudentMarks = mongoose.model('StudentMarks', feedStudentMarksSchema);
const producedResults = mongoose.model('SortedGrade', feedStudentMarksSchema)

module.exports = { StudentMarks, producedResults };
