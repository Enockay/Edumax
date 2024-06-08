const mongoose = require('mongoose');

const termfees = new mongoose.Schema({
    term: { type: String, required: false },
    tuitionFees: { required: true, type: Number },
    lunchFees: { required: false, type: Number },
    totalTuitionToBePaid: {required:true,type:Number},
    totalUniformFeesToBePaid:{required:true,type:Number},
    totalLunchFeesToBePaid : { required:true,type:Number}
});

const years = new mongoose.Schema({
    year: { type: String, required: false },
    termfees: { type: [termfees], required: false },
});

const fees = new mongoose.Schema({
    year: { type: [years], required: false },
});

const studentSchema = new mongoose.Schema({
    fullName: { required: true, type: String },
    guardianName: { required: true, type: String },
    guardianTel: { required: true, type: Number },
    admissionNumber: { required: true, type: Number },
    stream: { required: true, type: String },
    kcpeIndex: { required: true, type: Number },
    kcpeMarks: { required: true, type: Number },
    studentBirthNo: { required: true, type: String },
    dateOfAdmission: { required: true, type: String },
    gender: { required: true, type: String },
    formerSchool: { required: true, type: String },
    fees: { type: fees, required: false },
    uniformFees: { required: false, type: Number },
    boardingOrDay: { required: true, type: String },
});

const modelStudent = async (stream) => {
    const admitStudentModel = mongoose.model(stream, studentSchema);
    return admitStudentModel;
};

module.exports = modelStudent;
