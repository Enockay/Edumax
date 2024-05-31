const express = require('express');
const mongoose = require('mongoose');
const Classes = require('../../public/models/classes'); 
const ensureAuthenticated = require("./Auth");
const teacherAss = express.Router();

teacherAss.post('/update-subjects', async (req, res) => {
  const { year, term, teachingSubjects } = req.body;
  // Validate received data (optional if you trust the client-side validation)
  if (!year || !term || !Array.isArray(teachingSubjects)) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {
    // Create a new Classes document
    const newClasses = new Classes({ year, term, teachingSubjects });
    
    // Save the document to the database
    await newClasses.save();
    
    // Send a success response
    res.json({ message: 'Subjects updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

teacherAss.get('/assigned-units', async (req, res) => {
    try {
      // Fetch the latest entry
      const classesData = await Classes.findOne().sort({ _id: -1 }).exec();
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
