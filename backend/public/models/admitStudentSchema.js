const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    levi: { type: String, required: true },
    mode: { type: String, enum: ['Cash', 'Mpesa', 'Bank'], required: true },
    mpesaCode: { type: String },
    bankCode: { type: String },
    balance: {
        tuition: { type: Number },
        lunch: { type: Number },
    }
});

const termfeesSchema = new mongoose.Schema({
    term: { type: String, required: true },
    totalTuitionToBePaid: { type: Number, required: true },
    totalLunchFeesToBePaid: { type: Number, required: false },
    tuitionFees: { type: Number, required: true },
    lunchFees: { type: Number, required: false },
    payments: { type: [paymentSchema], required: false }
});

const yearsSchema = new mongoose.Schema({
    year: { type: String, required: true },
    totalBalance: { type: Number },
    termfees: { type: [termfeesSchema], required: true }
});

const feesSchema = new mongoose.Schema({
    year: { type: [yearsSchema], required: true },
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
    fees: { type: feesSchema, required: false },
    uniformFees: { required: false, type: Number },
    boardingOrDay: { required: true, type: String }
});

const modelStudent = async (form) => {
    const admitStudentModel = await mongoose.model(form, studentSchema);
    return admitStudentModel;
};

module.exports = modelStudent;
