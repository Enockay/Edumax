const express = require('express');
const router = express.Router();
const saveDocs = require("../../public/models/documentary");
const model = require("../../public/models/admitStudentSchema")

// Route to get students by stream
router.get('/stream/:id', async (req, res) => {
  const stream = req.params.id;

  try {
    const Student = await model(stream);
    const students = await Student.find({}).select('fullName admissionNumber stream');
    res.status(200).json({ success: true, students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students, please try again.' });
  }
});

router.post('/view',async(req,res) =>{
  try{
    const { documentaryName, teacherName } = req.body;

    const query = {documentaryName, teacherName };

    const  students = await  saveDocs.find(query);
    if(students.length > 0){
      //console.log(students)
      res.status(200).json({success:true,message:students})
    }
  }catch(error){
    res.status(304).json({success:true,message:"error occured"})
  }
 

})
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

router.get("/savedDoc/:id", async (req, res) => {
  try {
    const teacherName = req.params.id;
    const findDocuments = await saveDocs.find({ teacherName });

    if (findDocuments.length > 0) {
      res.status(200).json({ success: true, message: findDocuments });
    } else {
      res.status(304).json({ success: false });
    }
  } catch (error) {
    console.log("error occurred", error);
    res.status(500).json("internal server error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const docId = req.params.id;
    const document = await saveDocs.findById(docId);
    if (document) {
      res.status(200).json({ success: true, message: document });
    } else {
      res.status(404).json({ success: false, message: 'Document not found' });
    }
  } catch (error) {
    console.log("error occurred", error);
    res.status(500).json("internal server error");
  }
});

router.put("/updateDocs/:id", async (req, res) => {
  const { students, stream, docName, teacherName } = req.body;
  console.log("am triggerd")
  try {
    const docId = req.params.id;
    const updatedDocumentary = await saveDocs.findByIdAndUpdate(docId, {
      teacherName,
      documentaryName: docName,
      stream,
      students,
    }, { new: true });

    res.status(200).json({ success: true, message: `Updated ${docName}, check your Docs`, document: updatedDocumentary });
  } catch (error) {
    console.error('Error updating documentary:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
