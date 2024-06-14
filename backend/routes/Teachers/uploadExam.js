const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Exam = require('../../public/models/examsPdf');

dotenv.config();

const router = express.Router();
const secretKey = 'aOpJFUXdhe4Nt5i5RAKzbuStAPCLK5joDSqqUlfdtZg=';

// MongoDB URI
const mongoURI = process.env.MONGO_URL;

// Create mongo connection
mongoose.connect(mongoURI);
const conn = mongoose.connection;

let bucket;
conn.once('open', () => {
  bucket = new GridFSBucket(conn.db, {
    bucketName: 'uploads'
  });
 // console.log('GridFS Bucket initialized.');
});

// Create storage engine
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload file route
router.post('/uploadFile', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', async () => {
     // console.log('GridFS upload successful');

      try {
        const files = await bucket.find({ filename: req.file.originalname }).toArray();
        if (!files || files.length === 0) {
          //console.error('Error fetching file details: No files found');
          return res.status(500).json({ message: 'Error fetching file details' });
        }

        const uploadedFile = files[0];
       // console.log('Uploaded file details:', uploadedFile);
        res.status(200).json({ fileId: uploadedFile._id });  // Return fileId here
      } catch (err) {
        //console.error('Error fetching file details:', err);
        res.status(500).json({ message: 'Error fetching file details' });
      }
    });

    uploadStream.on('error', (err) => {
     // console.error('GridFS upload error:', err);
      res.status(500).json({ message: 'GridFS upload error' });
    });
  } catch (err) {
    console.error('Error during file upload:', err);
    res.status(500).json({ message: 'Error during file upload' });
  }
});

// Route to handle exam uploads
router.post('/upload', async (req, res) => {
  try {
    const token = req.body.token;
    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
       // console.error('Token verification failed:', err);
        return res.status(400).json({ message: 'your token is expired login again' });
      }

      const { name } = decoded;
      const { className, section, subject, dueDate, notification, fileId } = req.body;

      if (!fileId) {
        console.error('No file ID provided');
        return res.status(400).json({ message: 'No file ID provided' });
      }

      const newExam = new Exam({
        teacherName: name,
        className,
        section,
        subject,
        dueDate,
        notification,
        fileUrl: fileId,
        uploadedAt: new Date(),
        printed: false,
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
