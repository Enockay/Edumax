const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
  P1: { type: Number, required: false },
  P2: { type: Number, required: false },
  P3: { type: Number, required: false }
});

const unitSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  marks: { type: marksSchema, required: true },
  totalMarks : { type : Number, required : true},
  points : { type : String ,required : false},
  grade : { type : String , required : false},
});

const examSchema = new mongoose.Schema({
  term: { type: String, required: true },
  examType: { type: String, required: true },
  units: [unitSchema] ,
  totalPoints :{ type: String, required: false },
  totalGrade: { type: String, required: false },
  totalMarks: {type: String,required: false},
  classRank: { type: String, required: false },
  overallRank: { type: String, required: false }
});

const yearSchema = new mongoose.Schema({
  year: { type: String, required: true },
  exams: [examSchema]  // Array of exams for each year
});

const studentMarksSchema = new mongoose.Schema({
  studentAdmission: { type: String, required: true },
  studentName: { type: String, required: true },
  kcpe : {type:Number , required:false},
  years: [yearSchema],  // Array of years
  gender: { type: String, required: true },
  stream: { type: String, required: true },
  
});

const StudentMarks = mongoose.model('StudentMarks', studentMarksSchema);
const ProducedResults = mongoose.model('ProducedResults', studentMarksSchema);

module.exports = { StudentMarks, ProducedResults };
