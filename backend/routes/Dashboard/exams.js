const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Exam = require('../../public/models/examsPdf');

// Initialize GridFS
const conn = mongoose.connection;
let gfs, gridfsBucket;

conn.once('open', () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads',
  });
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads',
  });
 // console.log('GridFS initialized');
});

// Get all exams
router.get('/exams', async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Print an exam by ID
router.get('/exams/:id/print', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    exam.printed = true;
    await exam.save();

    res.json({ message: 'Exam marked as printed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// View a file from GridFS by ID
router.get('/file/:id', async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const file = await gfs.find({ _id: fileId }).toArray();

    if (!file || file.length === 0) {
      console.log("file not found");
      return res.status(404).json({ message: 'File not found' });
    }

    const readstream = gridfsBucket.openDownloadStream(fileId);
    readstream.on('error', (err) => {
      console.error('Stream error:', err);
      res.status(500).json({ message: 'Error streaming file' });
    });

    readstream.pipe(res);
  } catch (err) {
    console.error('Error fetching file:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
