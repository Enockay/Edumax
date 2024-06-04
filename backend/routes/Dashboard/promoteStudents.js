const express = require('express');
const router = express.Router();
const modelStudent = require('../../public/models/admitStudentSchema');
const { StudentMarks } = require('../../public/models/feedStudentMarks');
const mongoose = require("mongoose");

router.post('/promote', async (req, res) => {
    try {
        const { currentStream, nextStream } = req.body;

        // Fetch all students from the current stream
        const currentStudentModel = await modelStudent(currentStream);
        const nextStudentModel = await modelStudent(nextStream);

        const students = await currentStudentModel.find({});

        let studentsPromotedCount = 0;

        // Move students to the next class
        for (const student of students) {
            // Create a copy of the student in the next stream without the _id field
            const studentData = student.toObject();
            delete studentData._id;
            const newStudent = new nextStudentModel(studentData);
            newStudent.stream = nextStream; // Update stream
            await newStudent.save();
            
            // Find the student in the StudentMarks collection
            const user = await StudentMarks.findOne({ studentAdmission: student.admissionNumber });
            if (user) {
                const userId = user._id;
                // Update the student's stream in the student marks collection
                const updateResult = await StudentMarks.findByIdAndUpdate(userId, { stream: nextStream }, { new: true });
            } else {
                console.log(`No student marks found for admission number ${student.admissionNumber}`);
            }

            // Delete the student from the current stream
            await currentStudentModel.deleteOne({ _id: student._id });

            studentsPromotedCount++;
        }

        res.status(200).json({ message: `Promoted ${studentsPromotedCount} students successfully!` });
    } catch (error) {
        console.error('Error promoting students:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const GraduatingStudentSchema = new mongoose.Schema({
    admissionNumber: { type: String, required: true },
    fullName: { type: String, required: true },
    stream: { type: String, required: true },
    years: { type: [mongoose.Schema.Types.Mixed], required: true } // This field will hold the extracted year array
});

router.post('/graduate', async (req, res) => {
    try {
        const { graduatingStream, year } = req.body;

        const GraduatingStudent = mongoose.model(`Graduates_${year}`, GraduatingStudentSchema);
        // Fetch all students from the graduating stream
        const graduatingStudentModel = await modelStudent(graduatingStream);
        const students = await graduatingStudentModel.find({});

        for (const student of students) {
            // Find the student marks in the StudentMarks collection
            const studentMarks = await StudentMarks.findOne({ studentAdmission: student.admissionNumber });

            if (studentMarks) {
                // Extract the year array
                const studentYears = studentMarks.years;

                // Create a new graduating student instance and attach the year array
                const graduatingStudent = new GraduatingStudent({
                    admissionNumber: student.admissionNumber,
                    fullName: student.fullName,
                    stream: student.stream,
                    years: studentYears
                });

                // Save the graduating student
                await graduatingStudent.save();

                // Delete the student marks
                await StudentMarks.deleteOne({ studentAdmission: student.admissionNumber });

                // Delete the student from the current stream
                await graduatingStudentModel.deleteOne({ _id: student._id });

               // console.log(`Graduated student ${student.fullName} with admission number ${student.admissionNumber}`);
            } else {
               // console.log(`No student marks found for admission number ${student.admissionNumber}`);
            }
        }

        res.status(200).json({ message: 'Students graduated successfully!' });
    } catch (error) {
        console.error('Error graduating students:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;