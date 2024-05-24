const express = require("express");
const AdmitStudent = express.Router();
const processNewStudent = require("../public/javascripts/AdmitStudentToSystem")
const populateClasslist = require("../public/javascripts/populateClasslist");

AdmitStudent.post("/AdmitStudent", async (req, res) => {
    try {
        const {
            fullName,
                    guardianName,
                    guardianTel,
                    admissionNumber,
                    stream ,
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
        } = req.body
    //field for classList;
    const studentData = [
        {
            studentAdmission: admissionNumber,
            studentName: fullName,
            gender: gender
        }
    ]
    const studentFields = await populateClasslist(stream,studentData);

    const admittedStudent = await processNewStudent(
                    fullName,
                    guardianName,
                    guardianTel,
                    admissionNumber,
                    stream ,
                    kcpeIndex,
                    kcpeMarks,
                    studentBirthNo,
                    dateOfAdmission,
                    gender,
                    formerSchool,
                    tuitionFees,
                    uniformFees,
                    lunchFees,
                    boardingOrDay);

        res.status(200).json(admittedStudent);
    } catch (error) {
        res.status(500).json(`error while admitting student ${error}`)
    }
});

module.exports = AdmitStudent;