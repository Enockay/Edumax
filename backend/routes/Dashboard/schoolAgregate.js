const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Adjust the path to where your modelStudent function is located
const modelStudent = require('../../public/models/admitStudentSchema');

const collections = ['1easts', '1wests', '2easts', '2wests', '3easts', '3wests', '4easts', '4wests'];

router.get('/api/aggregate', async (req, res) => {
  try {
    let totalMales = 0;
    let totalFemales = 0;
    let totalStudents = 0;
    const forms = {
      form4: { east: 0, west: 0, easts: 0, wests: 0 },
      form3: { east: 0, west: 0, easts: 0, wests: 0 },
      form2: { east: 0, west: 0, easts: 0, wests: 0 },
      form1: { east: 0, west: 0, easts: 0, wests: 0 },
    };

    for (const collectionName of collections) {
      const collection = mongoose.connection.collection(collectionName);
      const students = await collection.find({}).toArray();
      
      const males = students.filter(student => student.gender === 'male').length;
      const females = students.filter(student => student.gender === 'female').length;
      
      totalMales += males;
      totalFemales += females;
      totalStudents += students.length;

      const match = collectionName.match(/(\d+)(easts|wests)/); // Extract form number and side
      if (match) {
        const form = match[1]; // Get form number
        const side = match[2]; // Get side (easts/wests)
        forms[`form${form}`][side] += students.length;
        forms[`form${form}`][`${side}s`] += females; // Add females count to corresponding side
      }
    }
    
    res.status(200).json({ totalMales, totalFemales, totalStudents, forms });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
});

module.exports = router;
