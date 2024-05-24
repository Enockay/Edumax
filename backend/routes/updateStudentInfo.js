const express = require('express');
const updateStudentInfo = express.Router();
const modelStudent = require('../public/models/admitStudentSchema');

// Fetch student data
updateStudentInfo.get('/:stream/:admissionNumber', async (req, res) => {
    const { stream, admissionNumber } = req.params;
    try{
        const studentSchema = await modelStudent(stream);
        const fetchStudents = await studentSchema.find({admissionNumber});
        //console.log(fetchStudents)
        res.status(200).json(fetchStudents)
    }catch(error){
        res.status(400).json(error)
    } 
});

// Update student data
updateStudentInfo.put('/:stream/:admissionNumber', (req, res) => {
    const { stream, admissionNumber } = req.params;
    const studentSchema = modelStudent(stream);
});

// Delete student data
updateStudentInfo.delete('/:stream/:admissionNumber', (req, res) => {
    const { stream, admissionNumber } = req.params;
    const studentSchema = modelStudent(stream);
  
});

module.exports = updateStudentInfo;
