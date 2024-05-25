const express = require('express');
const updateStudentInfo = express.Router();
const modelStudent = require('../public/models/admitStudentSchema');

// Fetch student data
updateStudentInfo.get('/:stream/:admissionNumber', async (req, res) => {
    const { stream, admissionNumber } = req.params;
    try{
        const studentSchema = await modelStudent(stream);
        const fetchStudents = await studentSchema.find({admissionNumber});

        if(fetchStudents.length > 0){
          res.status(200).json(fetchStudents)
        }else{
            res.status(204).json("Student Not found in The System")
        }
        
    }catch(error){
        res.status(400).json(error)
    } 
});

// Update student data
updateStudentInfo.put('/:stream/:admissionNumber', async (req, res) => {
    try{
        const { stream, admissionNumber } = req.params;
        const updatedData = req.body;
       // console.log(updatedData)
        const studentSchema = modelStudent(stream);
        const result = (await studentSchema).updateOne(
            {admissionNumber : admissionNumber},
            {$set : updatedData}
        );
        res.status(200).json('successfully updated student information')
    }catch(error){
        res.status(400).json("error occured while updating student infomation")
    }
    
});

// Delete student data
updateStudentInfo.delete('/:stream/:admissionNumber', async (req, res) => {
    try{
        const { stream, admissionNumber } = req.params;
        const studentSchema = modelStudent(stream);
        await studentSchema.findByIdAndDelete(admissionNumber);
        res.status(200).json("successfully deleted the student")
    }catch(error){
        res.status(400).json("errorr occured while deleting student")

    }
    
  
});

module.exports = updateStudentInfo;
