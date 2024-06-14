const express = require('express');
const router = express.Router();
const model = require('../../public/models/admitStudentSchema'); // Adjust path as per your project structure
const saveDocs = require("../../public/models/documentary");

// Route to get students by stream
router.get('/stream/:id', async (req, res) => {
  const stream  = req.params.id;
  console.log(stream);

  try {
      const Student = await model(stream); // Assuming model returns the Mongoose model for each stream
      const students = await Student.find({}).select('fullName admissionNumber stream');

    res.status(200).json({ success: true, students });
    
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students, please try again.' });
  }
});

router.post('/saveDocs', async (req, res) => {
  const { students, stream, docName, teacherName } = req.body;

  try {
    const newDocumentary = new saveDocs({
      teacherName,
      documentaryName: docName,
      stream,
      students,
    });

    await newDocumentary.save();
    res.status(200).json({ success: true, message: `Saved ${docName}, check your Docs` });
  } catch (error) {
    console.error('Error saving documentary:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/savedDoc/:id",async (req,res)=> {
   try{
    const teacherName = req.params.id;
    console.log(teacherName)
    const findDocuments = await saveDocs.find({teacherName});
    if(findDocuments.length > 0){
      res.status(200).json({success:true,message:findDocuments})
    }else{
      res.status(304).json({success:false})
    }

   }catch(error){
    console.log("error occured",error)
    res.status(500).json("internal server error");

   }
});

router.post("/view" , async (req,res) => {
  try{
    const {documentaryName, teacherName} = req.body;
    console.log(documentaryName, teacherName);

    const querry = { documentaryName, teacherName };

    const feedback = await saveDocs.findOne(querry);
    //console.log(feedback);
      res.status(200).json({success:true,message : feedback})

  }catch(err){
    console.log("err occured",err);
    res.status(500).json("internal server error")
  }
})

module.exports = router;