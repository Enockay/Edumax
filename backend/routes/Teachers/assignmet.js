const express = require("express");
const jwt = require('jsonwebtoken');
const Assignment = require("../../public/models/assigments");
const assign = express.Router();

assign.get('/api/assignments/:id', async (req, res) => {
    const teacherName = req.params.id
    try {
        const assignments = await Assignment.find({ teacherName: teacherName });
        if(assignments.length > 0){
            res.status(200).json({success:true,message:assignments});
        }else{
            res.status(210).json({message:"No saved Assignment yet"})
        }
        
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).send('Error fetching assignments');
    }
});

assign.post('/api/assignments/:id',  async (req, res) => {
    const  teacherName = req.params.id;
    console.log(teacherName);
    const { week, className, subject, assignmentText } = req.body;

    if (!week || !className || !subject || !assignmentText) {
        return res.status(400).send('All fields are required');
    }

    try {
        const newAssignment = new Assignment({ week, className, subject, assignmentText, teacherName });
        await newAssignment.save();
        res.status(201).json(newAssignment);
    } catch (error) {
        console.error('Error adding assignment:', error);
        res.status(500).send('Error adding assignment');
    }
});

assign.delete('/api/assignments/cleanup/:id', async (req, res) => {
    const teacherName = req.params.id
    try {
        await Assignment.deleteMany({ teacherName: teacherName });
        res.status(200).send('All assignments have been cleaned up');
    } catch (error) {
        console.error('Error cleaning up assignments:', error);
        res.status(500).send('Error cleaning up assignments');
    }
});

assign.delete('/api/assignments/:teacherName/:assignmentId', async (req, res) => {
    const { teacherName, assignmentId } = req.params;
    try {
        const result = await Assignment.deleteOne({ _id: assignmentId, teacherName: teacherName });
        if (result.deletedCount === 1) {
            res.status(200).send('Assignment deleted successfully');
        } else {
            res.status(404).send('Assignment not found');
        }
    } catch (error) {
        console.error('Error deleting assignment:', error);
        res.status(500).send('Error deleting assignment');
    }
});


module.exports = assign;
