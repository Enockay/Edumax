const express = require('express');
const AdmitStudent = express.Router();
const populateStudentField = require('../../public/javascripts/populateClasslist'); // Adjust the path as needed
const processNewStudent = require("../../public/javascripts/AdmitStudentToSystem");

AdmitStudent.post("/AdmitStudent", async (req, res) => {
  try {
    const {
      fullName,
      guardianName,
      guardianTel,
      admissionNumber,
      stream,
      kcpeIndex,
      kcpeMarks,
      studentBirthNo,
      dateOfAdmission,
      gender,
      formerSchool,
      tuitionFees,
      uniformFees,
      lunchFees,
      boardingOrDay
    } = req.body;

    // Prepare data for populating student fields
    const studentData = [{
      studentAdmission: admissionNumber,
      studentName: fullName,
      gender: gender
    }];

    // Populate student fields based on the provided data
    await populateStudentField(stream, studentData); // Correct function call

    // Process admission of the student
    const admittedStudent = await processNewStudent(
      fullName,
      guardianName,
      guardianTel,
      admissionNumber,
      stream,
      kcpeIndex,
      kcpeMarks,
      studentBirthNo,
      dateOfAdmission,
      gender,
      formerSchool,
      tuitionFees,
      uniformFees,
      lunchFees,
      boardingOrDay
    );

    res.status(200).json(admittedStudent);
  } catch (error) {
    res.status(500).json(`error while admitting student ${error}`);
  }
});

module.exports = AdmitStudent;
