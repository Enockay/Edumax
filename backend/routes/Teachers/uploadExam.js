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

router.post('/exams/upload', upload.single('file'), async (req, res) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        console.error('Token verification failed:', err);
        return res.status(500).json({ message: 'Failed to authenticate token' });
      }

      const { name } = decoded;
      const { className, subject, notification } = req.body;
      const fileUrl = req.file.path;

      console.log('Decoded token:', decoded);
      console.log('Request body:', req.body);
      console.log('File path:', fileUrl);

      const newExam = new Exam({
        teacherName: name,
        className,
        subject,
        notification,
        fileUrl,
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
