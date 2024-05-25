const express = require('express')
const updateStudentMarks = express.Router();
const { StudentMarks } = require("../../public/models/feedStudentMarks")

updateStudentMarks.put('/students/:id/marks', async (req, res) => {
    const { id } = req.params;
    const { unit, marks } = req.body;

    try {
        const student = await StudentMarks.findById(id);
        if (!student) return res.status(404).send('Student not found');

        student.units[unit] = { ...student.units[unit], ...marks };
        await student.save();
        res.send('Marks updated successfully');
    } catch (error) {
        res.status(500).send('Server Error');
        console.log(error);
    }
});

module.exports = updateStudentMarks;
