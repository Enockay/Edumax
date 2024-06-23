const mongoose = require('mongoose');
const express = require('express');
const student = require('../../public/models/admitStudentSchema'); // Assuming this is where your Mongoose model is defined
const profile = express.Router();


const streams = ["1East", "1West", "2East", "2West", "3East", "3West", "4East", "4West"];

profile.post('/profile', async (req, res) => {
  const { admission } = req.query;

  try {
    let studentFound = null;

    for (const stream of streams) {
      const model = await student(stream); // Assuming `student` is a function that returns a Mongoose model
      const students = await model.find({ admissionNumber: admission });

      if (students.length > 0) {
        studentFound = students[0];
        break; // Exit the loop once the student is found
      }
    }

    if (studentFound) {
      res.status(200).json({ success: true, message: studentFound });
    } else {
      res.status(404).json({ success: false, message: 'Student not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = profile;
