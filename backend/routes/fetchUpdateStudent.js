const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const studentSchema = require('../public/models/admitStudentSchema'); // Adjust the path to your schema file

router.get('/students/:admissionNumber', async (req, res) => {
    try {
        const admissionNumber = req.params.admissionNumber;
        const student = await studentSchema.findOne({ admissionNumber });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
