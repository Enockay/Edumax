const { StudentMarks } = require("../models/feedStudentMarks");

const populateStudentField = async (stream, studentData) => {
  try {
    console.log(stream, studentData);
    const studentDocs = studentData.map(student => ({
      studentAdmission: student.studentAdmission,
      studentName: student.studentName,
      years: [], // Initialize with an empty array for years
      gender: student.gender,
      stream: stream
    }));

    await StudentMarks.insertMany(studentDocs);
  } catch (error) {
    console.error("Error populating student fields:", error);
  }
};

module.exports = populateStudentField;
