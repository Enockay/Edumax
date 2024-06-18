const express = require('express');
const router = express.Router();
const Attendance = require('../../public/models/Attendance'); // Assuming you have a Mongoose model
const Student = require('../../public/models/admitStudentSchema'); // Assuming you have a Mongoose model for students
const jwt = require("jsonwebtoken");
const key = 'aOpJFUXdhe4Nt5i5RAKzbuStAPCLK5joDSqqUlfdtZg=';

const verifyToken = async (token) => {
    try {
        const decodedToken = await jwt.verify(token, key);
        const teacher = decodedToken.name;
        return teacher;
    } catch (error) {
        console.error(error);
        return null; // Changed to return null to handle the session expiration in the route handler
    }
}

// Fetch attendance data
router.get('/attendance', async (req, res) => {
    const { year, term, uniqueId,teacherName } = req.query;

    try {
        const data = await Attendance.findOne({ year, term, uniqueId,teacher:teacherName });
        if (!data) {
            return res.status(404).json({ message: 'No attendance data found' });
        }
        res.json(data);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/attendance', async (req, res) => {
    const { uniqueId, modifiedAttendance, modifiedNotes, modifiedClassNotes } = req.body;

    try {
        const existingAttendance = await Attendance.findOne({ uniqueId });

        if (!existingAttendance) {
            return res.status(404).json({ message: 'No attendance data found' });
        }

        // Update modified attendance
        if (modifiedAttendance) {
            Object.keys(modifiedAttendance).forEach(studentId => {
                const student = existingAttendance.weeks
                    .flatMap(week => week.students)
                    .find(s => s._id.toString() === studentId);
                if (student) {
                    Object.keys(modifiedAttendance[studentId]).forEach(dayIndex => {
                        student.attendance[dayIndex].attendance = modifiedAttendance[studentId][dayIndex];
                    });
                }
            });
        }

        // Update modified notes
        if (modifiedNotes) {
            Object.keys(modifiedNotes).forEach(studentId => {
                const student = existingAttendance.weeks
                    .flatMap(week => week.students)
                    .find(s => s._id.toString() === studentId);
                if (student) {
                    Object.keys(modifiedNotes[studentId]).forEach(dayIndex => {
                        student.attendance[dayIndex].note = modifiedNotes[studentId][dayIndex];
                    });
                }
            });
        }

        // Update modified class notes
        if (modifiedClassNotes) {
            Object.keys(modifiedClassNotes).forEach(weekIndex => {
                // Check if modifiedClassNotes[weekIndex] is an array
                if (Array.isArray(modifiedClassNotes[weekIndex])) {
                    existingAttendance.weeks[weekIndex].classNotes = modifiedClassNotes[weekIndex].map(note => ({
                        date: new Date(note.date),
                        note: note.note
                    }));
                } else {
                    console.error(`Expected array at modifiedClassNotes[${weekIndex}] but got`, typeof modifiedClassNotes[weekIndex]);
                }
            });
        }

        await existingAttendance.save();
        res.json(existingAttendance);
    } catch (error) {
        console.error("Error updating attendance:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

// Fetch students by stream
router.get('/students', async (req, res) => {
    const { stream } = req.query;

    try {
        const studentModel = await Student(stream);

        const students = await studentModel.find({ stream }).select('admissionNumber fullName');
        res.status(200).json(students);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' });
    }
});

// Create attendance sheet
router.post('/setup-attendance', async (req, res) => {
    const { year, term, uniqueId, stream, startDate, weeks, token } = req.body;
    //console.log(req.body)
    try {
        const teacher = await verifyToken(token);
        if (!teacher) {
            return res.status(400).json({ message: 'Session expired, login again' });
        }

        const newAttendanceSheet = new Attendance({ year, term, uniqueId, stream, startDate, weeks, teacher });
        const result = await newAttendanceSheet.save();
        res.json(result);
    } catch (error) {
        console.error("Error creating attendance sheet:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
