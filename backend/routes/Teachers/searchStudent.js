const express = require('express');
const router = express.Router();
const model = require('../../public/models/admitStudentSchema'); // Adjust the path as per your project structure

// Define the streams array with correct individual stream names
const streams = ['1East', '1West', '2West', '2East', '3East', '3West', '4East', '4West'];

// Route to search for students by admission number or name
router.get('/students/search', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required.' });
  }

  try {
    const promises = streams.map(async (stream) => {
      const Student = await model(stream); // Assuming model returns the Mongoose model for each stream

      // Perform the search for students in each stream
      const students = await Student.find({
        $or: [
          { admissionNumber: { $regex: new RegExp(query, 'i') } }, // Case-insensitive search for admission number
          { fullName: { $regex: new RegExp(query, 'i') } }, // Case-insensitive search for full name
        ],
      }).select('fullName admissionNumber stream kcpeIndex dateOfAdmission');

      return { stream, students }; // Return an object with stream name and matching students
    });

    // Wait for all promises to resolve and collect results
    const results = await Promise.all(promises);

    // Combine results from all streams into a single response
    const combinedStudents = results.flatMap(result =>
      result.students.map(student => ({
        stream: result.stream,
        fullName: student.fullName,
        admissionNumber: student.admissionNumber,
        kcpeIndex: student.kcpeIndex,
        dateOfAdmission: student.dateOfAdmission,
      }))
    );

    res.status(200).json({ success: true, students: combinedStudents });
  } catch (error) {
    console.error('Error searching students:', error);
    res.status(500).json({ message: 'Error searching students, please try again.' });
  }
});

module.exports = router;
