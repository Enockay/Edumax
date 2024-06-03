const express = require('express');
const jwt = require('jsonwebtoken');
const teacherLoginModel = require('../../public/models/teacherslogin');
const teacher = express.Router();
const bcrypt = require('bcryptjs');


teacher.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const key = 'aOpJFUXdhe4Nt5i5RAKzbuStAPCLK5joDSqqUlfdtZg=';

    try {
        const user = await teacherLoginModel.findOne({ username });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(300).json({ message: 'Invalid credentials' });
        }

        // Extract user profile information
        const { _id, name, email, gender } = user;

        // Create JWT token with user profile information
        const token = jwt.sign({ id: _id, name, email, gender }, key, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Updated register route in staffs.js
teacher.post('/register', async (req, res) => {
    const { username, password, email, name, gender } = req.body;

    try {
        // Check if the email exists in the system
        const existingTeacher = await teacherLoginModel.findOne({ email });
        if (!existingTeacher) {
            return res.status(400).json({ message: 'Email not found in the system. Please contact admin.' });
        }

        // Update the existing teacher entry with the remaining details
        existingTeacher.username = username;
        existingTeacher.password = password;
        existingTeacher.name = name;
        existingTeacher.gender = gender;

        // Save the updated teacher to the database
        await existingTeacher.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = teacher;
