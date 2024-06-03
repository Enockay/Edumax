// routes/teachers.js
const express = require('express');
const Teacher = require('../../public/models/teacherslogin');

const staff = express.Router();

// Fetch all teachers
staff.get('/fetch', async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.json(teachers);
    } catch (err) {
        res.status(500).send('Network Error While fetching teachers');
    }
});

// Updated add teacher route in staffs.js
staff.post('/post', async (req, res) => {
    const { email, name } = req.body;

    if (!email || !name) {
        return res.status(400).json({ message: 'Email and name are required' });
    }

    try {
        // Check if the email already exists
        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return res.status(400).json({ message: 'Email already exists in the system' });
        }

        // Create a new teacher entry
        const newTeacher = new Teacher({
            email,
            name,
        });

        // Save the teacher to the database
        await newTeacher.save();
        res.status(201).json(newTeacher);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Delete a teacher
staff.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Teacher.findByIdAndDelete(id);
        res.status(200).send('Teacher deleted successfully');
    } catch (err) {
        res.status(500).send('Failed to delete teacher.');
    }
});

module.exports = staff;
