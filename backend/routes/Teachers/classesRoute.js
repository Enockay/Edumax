const express = require('express');
const mongoose = require('mongoose');
const Classes = require('../../public/models/classes'); // Ensure you import the Classes model
const ensureAuthenticated = require("./Auth");
const teacherAss = express.Router();

teacherAss.post('/update-subjects',  async (req, res) => {
  const { teacherName, year, term, teachingSubjects } = req.body;

  // Validate received data
  if (!teacherName || !year || !term || !Array.isArray(teachingSubjects)) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {
    // Check if the teacher exists in the Classes model
    let existingClass = await Classes.findOne({ teacherName, year, term });

    if (existingClass) {
      // Update the existing class document
      existingClass.teachingSubjects = teachingSubjects;
      await existingClass.save();
    } else {
      // Create a new class document if it doesn't exist
      existingClass = new Classes({ teacherName, year, term, teachingSubjects });
      await existingClass.save();
    }

    // Send a success response
    res.json({ message: `Subjects updated successfully for ${teacherName}`, data: existingClass });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

teacherAss.get('/assigned-units/:id', async (req, res) => {
    try {
      // Fetch the latest entry
      const teacherName = req.params.id;
      const classesData = await Classes.find({teacherName});
      if (!classesData) {
        return res.status(201).json({ error: 'No units found' });
      }
      res.status(200).json(classesData);
    } catch (error) {
      console.error('Error fetching assigned units:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  teacherAss.post('/delete-unit', async (req, res) => {
    const { year, term, stream, unit } = req.body;
  
    try {
      const updatedClass = await Classes.findOneAndUpdate(
        {
          year,
          term,
          'teachingSubjects.stream': stream,
        },
        {
          $pull: { 'teachingSubjects.$.units': { name: unit } },
        },
        { new: true }
      );
  
      if (!updatedClass) {
        return res.json({ success: false, error: 'Class or stream not found' });
      }
  
      res.json({ success: true, updatedClass });
    } catch (error) {
      res.json({ success: false, error: error.message });
    }
  });
  
  
module.exports = teacherAss;
