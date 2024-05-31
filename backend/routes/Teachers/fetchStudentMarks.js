const express = require('express');
const fetchMarks = express.Router();
const { StudentMarks } = require("../../public/models/feedStudentMarks");
const ensureAuthenticated = require("./Auth");

fetchMarks.get('/students/marks/get',async (req, res) => {
    const { stream, unit, term, examType, year } = req.query;

    try {
        const students = await StudentMarks.find({ stream, 'units.subject': unit });

        if (students.length === 0) {
            return res.status(404).send('No students found');
        }

        const marksData = students.map(student => {
            const examKey = `${year}_${term}_${examType}`;
            const marks = student.units[unit]?.exams?.[examKey]?.marks || {};
            return {
                studentId: student._id,
                studentAdmission: student.studentAdmission,
                studentName: student.studentName,
                marks
            };
        });

        res.json(marksData);
    } catch (error) {
        res.status(500).send('Server Error');
        console.log(error);
    }
});

module.exports = fetchMarks;
