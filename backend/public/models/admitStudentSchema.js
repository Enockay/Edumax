const mongoose = require('mongoose');

// Define payment schema
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

// Define term fees schema
const termfeesSchema = new mongoose.Schema({
    term: { type: String, required: true },
    totalTuitionToBePaid: { type: Number, required: true },
    totalLunchFeesToBePaid: { type: Number, required: false },
    tuitionFees: { type: Number, required: true },
    lunchFees: { type: Number, required: false },
    payments: { type: [paymentSchema], required: false }
});

// Define years schema
const yearsSchema = new mongoose.Schema({
    year: { type: String, required: true },
    totalBalance: { type: Number },
    termfees: { type: [termfeesSchema], required: true }
});

// Define fees schema
const feesSchema = new mongoose.Schema({
    year: { type: [yearsSchema], required: true },
});

// Define student schema
const studentSchema = new mongoose.Schema({
    fullName: { required: true, type: String },
    guardianName: { required: true, type: String },
    guardianTel: { required: true, type: String },
    admissionNumber: { required: true, type: String },
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

// Define middleware to update totalBalance after payment
paymentSchema.post('save', async function(doc) {
    console.log('Payment Schema Post Save Middleware Triggered');
    
    if (!doc) {
        console.error('No document found in paymentSchema post save middleware.');
        return;
    }

    try {
        console.log('Received Document:', doc);

        const studentModel = mongoose.model('Student', studentSchema);

        // Find the student associated with this payment
        const student = await studentModel.findOne({ 'fees.year.termfees.payments._id': doc._id });

        if (!student) {
            console.error('Student not found.');
            return;
        }

        console.log('Student Found:', student);

        // Calculate the new totalBalance
        let totalBalance = 0;
        student.fees.year.forEach((year) => {
            year.termfees.forEach((term) => {
                totalBalance += (term.tuitionFees || 0) + (term.lunchFees || 0);
            });
        });

        // Update the student's totalBalance
        student.fees.year.forEach((year) => {
            year.totalBalance = totalBalance;
        });

        // Save the updated student document
        await student.save();

        console.log('Total Balance Updated Successfully:', totalBalance);
    } catch (error) {
        console.error('Error in paymentSchema post save middleware:', error);
    }
});

// Define modelStudent function
const modelStudent = async (form) => {
    return mongoose.model(form, studentSchema);
};

module.exports = modelStudent;
