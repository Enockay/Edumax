const express = require('express');
const router = express.Router();
const modelStudent = require('../../public/models/admitStudentSchema');
const { StudentMarks } = require('../../public/models/feedStudentMarks');
const mongoose = require("mongoose");

router.post('/promote', async (req, res) => {
    try {
        const { currentStream, nextStream } = req.body;

        // Fetch all students from the current stream
        const currentStudentModel = await modelStudent(currentStream);
        const nextStudentModel = await modelStudent(nextStream);

        const students = await currentStudentModel.find({});

        // Move students to the next class
        for (const student of students) {
            await nextStudentModel.create(student.toObject());
            await currentStudentModel.deleteOne({ _id: student._id });
        }

        res.status(200).json({ message: 'Students promoted successfully!' });
    } catch (error) {
        console.error('Error promoting students:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/graduate', async (req, res) => {
    try {
        const { graduatingStream, year } = req.body;

        // Fetch all students from the graduating stream
        const graduatingStudentModel = await modelStudent(graduatingStream);
        const students = await graduatingStudentModel.find({});

        // Create an archive collection based on the year
        const archiveModel = mongoose.model(`Graduates_${year}`, studentSchema);

        for (const student of students) {
            await archiveModel.create(student.toObject());
            await graduatingStudentModel.deleteOne({ _id: student._id });
        }

        res.status(200).json({ message: 'Students graduated successfully!' });
    } catch (error) {
        console.error('Error graduating students:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
