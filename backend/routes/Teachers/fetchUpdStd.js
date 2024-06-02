const express = require('express');
const { StudentMarks } = require('../../public/models/feedStudentMarks'); // Adjust the path accordingly
const ensureAuthenticated = require("./Auth");
const updateStudent = express.Router();

// Fetch Marks Endpoint
updateStudent.get('/student/UpdMark', async (req, res) => {
  const { year, examType, stream, subject } = req.query;

  if (!year || !examType || !stream || !subject) {
    return res.status(202).send('Missing required query parameters: year, examType, stream, subject');
  }

  try {
    const students = await StudentMarks.find({ stream });

    const result = students.map(student => {
      const unit = student.units[subject];
      if (unit) {
        const exam = unit.exams.find(exam => exam.year === year && exam.examType === examType);
        if (exam) {
          return {
            _id: student._id,
            studentAdmission: student.studentAdmission,
            studentName: student.studentName,
            marks: exam.marks
          };
        }
      }
      return null;
    }).filter(student => student !== null);

    if (result.length === 0) {
      return res.status(201).send('No marks found for the given criteria');
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).send('Error fetching marks, please try again.');
  }
});

// Update Marks Endpoint
updateStudent.put('/student/putMark', async (req, res) => {
  try {
    const updates = req.body;

    const bulkOps = updates.map(update => {
      const { id, unit, examType, year, marks } = update;

      return {
        updateOne: {
          filter: { _id: id, [`years[0].year`]: year, [`years[0].year[0].exams.examType`]: examType },
          update: {
            $set: {
              [`units.${unit}.$.marks`]: marks
            }
          },
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
