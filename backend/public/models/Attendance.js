const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceDaySchema = new Schema({
    date: { type: Date, required: true },
    attendance: { type: Boolean, default: true }, // Defaults to true (present)
    note: { type: String, default: '' } // Default to empty string
});

const studentSchema = new Schema({
    admissionNumber: { type: String, required: true },
    fullName: { type: String, required: true },
    attendance: { type: [attendanceDaySchema], default: [] } // Initialize as empty array
});

const weekSchema = new Schema({
    week: { type: Number, required: true },
    students: { type: [studentSchema], required: true },
    classNotes: { 
        type: [{ 
            date: { type: Date, required: true },
            note: { type: String, default: '' } // Default to empty string
        }], 
        default: [] // Initialize as empty array
    }
});

const attendanceSchema = new Schema({
    teacher: { type: String, required: false },
    year: { type: String, required: true },
    term: { type: String, required: true },
    uniqueId: { type: String, required: true },
    stream: { type: String, required: true },
    startDate: { type: Date, required: true },
    weeks: { type: [weekSchema], required: true }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
