const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Exam = require('../../public/models/examsPdf');
const secretKey = 'aOpJFUXdhe4Nt5i5RAKzbuStAPCLK5joDSqqUlfdtZg='; // Replace with your actual secret key

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.post('/exams/uploadFile', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({ filePath: req.file.path });
});

router.post('/exams/upload', async (req, res) => {
  try {
    const token = req.body.token;
    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        console.error('Token verification failed:', err);
        return res.status(500).json({ message: 'Failed to authenticate token' });
      }

      const { name } = decoded;
      const { className, section, subject, dueDate, notification, filePath } = req.body;

      const newExam = new Exam({
        teacherName: name,
        className,
        section,
        subject,
        dueDate,
        notification,
        fileUrl: filePath,
        uploadedAt: new Date(),
        printed: false
      });

      await newExam.save();
      res.status(201).json({ message: 'Exam uploaded successfully', exam: newExam });
    });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
