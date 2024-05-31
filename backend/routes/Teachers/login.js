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

// Registration endpoint
teacher.post('/register', async (req, res) => {
    const { username, password, email, name, gender } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await teacherLoginModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Create a new user
        const newUser = new teacherLoginModel({
            username,
            password,
            email,
            name,
            gender
        });

        // Save the user to the database
        await newUser.save();
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = teacher;
