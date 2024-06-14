const express = require('express');
const { StudentMarks } = require('../../public/models/feedStudentMarks'); // Adjust the path accordingly
const ensureAuthenticated = require("./Auth");
const updateStudent = express.Router();

// Fetch Marks Endpoint
updateStudent.get('/student/UpdMark', async (req, res) => {
  const { year, examType, stream, subject } = req.query;

  if (!year || !examType || !stream || !subject) {
    return res.status(400).json({ message: 'Missing required query parameters: year, examType, stream, subject' });
  }

  try {
    const students = await StudentMarks.find({ stream });

    const result = students.map(student => {
      const yearData = student.years.find(yearData => yearData.year === year);
      if (yearData) {
        const exam = yearData.exams.find(exam => exam.examType === examType);
        if (exam) {
          const unit = exam.units.find(unit => unit.subject === subject);
          if (unit) {
            return {
              _id: student._id,
              studentAdmission: student.studentAdmission,
              studentName: student.studentName,
              marks: unit.marks
            };
          }
        }
      }
      return null;
    }).filter(student => student !== null);

    if (result.length === 0) {
      return res.status(404).json({ message: 'No marks found for the given criteria' });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).json({ message: 'Error fetching marks, please try again.' });
  }
});

// Update Marks Endpoint
updateStudent.put('/student/putMark', async (req, res) => {
  try {
    const updates = req.body;

    const bulkOps = updates.map(update => {
      const { id, year, examType, unit, marks } = update;

      return {
        updateOne: {
          filter: { _id: id, 'years.year': year, 'years.exams.examType': examType, 'years.exams.units.subject': unit },
          update: {
            $set: {
              'years.$.exams.$[outer].units.$[inner].marks': marks
            }
          },
          arrayFilters: [{ 'outer.examType': examType }, { 'inner.subject': unit }],
          upsert: true
        }
      };
    });

    await StudentMarks.bulkWrite(bulkOps);

    res.status(200).send('Marks updated successfully!');
  } catch (error) {
    console.error('Error updating marks:', error);
    res.status(500).send('Error updating marks, please try again.');
  }
});

module.exports = updateStudent;
