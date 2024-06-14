const express = require('express');
const router = express.Router();
const Documentary = require('../../public/models/documentary'); 

router.post('/documentary/save', async (req, res) => {
  const { stream, students,documentaryName,teacherName, } = req.body;

  try {
    const newDocumentary = new Documentary({
      teacherName,
      documentaryName,
      stream,
      students,
    });

    await newDocumentary.save();

    res.status(200).json({ success: true, message: `New documentary added ${documentaryName} successfully` });
  } catch (error) {
    console.error('Error saving documentary:', error);
    res.status(500).json({ success: false, message: 'Error saving documentary, please try again.' });
  }
});

module.exports = router;
