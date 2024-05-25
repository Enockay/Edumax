const express = require('express');
const studentMarksUpdate= express.Router();
const { StudentMarks } = require('../../public/models/feedStudentMarks'); // Adjust the path accordingly

studentMarksUpdate.get('/students', async (req, res) => {
    const { stream, unit } = req.query;
    try {
        const students = await StudentMarks.find({ stream }).select('studentAdmission studentName units');
        res.json(students);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

module.exports = studentMarksUpdate;
