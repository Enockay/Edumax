const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    levi: { type: String, required: true },
});

const termfees = new mongoose.Schema({
    term: { type: String, required: true },
    totalTuitionToBePaid: { type: Number, required: true },
    totalUniformFeesToBePaid: { type: Number, required: false },
    totalLunchFeesToBePaid: { type: Number, required: false },
    tuitionFees: { type: Number, required: true },
    uniformFees: { type: Number, required: false },
    lunchFees: { type: Number, required: false },
    payments: { type: [paymentSchema], required: false }
});

const years = new mongoose.Schema({
    year: { type: String, required: true },
    termfees: { type: [termfees], required: true }
});

const fees = new mongoose.Schema({
    year: { type: [years], required: true },
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
    boardingOrDay: { required: true, type: String }
});

const modelStudent = async (form) => {
    const admitStudentModel = await mongoose.model(form, studentSchema);
    return admitStudentModel;
};

module.exports = modelStudent;
