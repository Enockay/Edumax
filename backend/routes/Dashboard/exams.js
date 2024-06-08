const express = require('express');
const router = express.Router();
const Exam = require('../../public/models/examsPdf');

router.get('/exams', async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/exams/:id/print', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    exam.printed = true;
    await exam.save();

    res.json({ message: 'Exam marked as printed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
