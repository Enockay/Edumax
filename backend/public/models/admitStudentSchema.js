const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    fullName : {
        required: true,
        type : String
    },

    guardianName : {
        required : true,
        type : String
    },
    guardianTel : {
        required : true,
        type : Number
    },

    admissionNumber : {
        required : true,
        type : Number
    },

    stream : {
        required : true,
        type : String
    },
    kcpeIndex : {
        required : true,
        type : Number
    },

    kcpeMarks : {
        required: true,
        type : Number
    },

    studentBirthNo : {
         required : true,
         type : String
    },

    dateOfAdmission : {
        required : true,
        type : String
    },

    gender : {
        required : true,
        type : String
    },
    
    formerSchool : {
        required : true,
        type : String
    },

    tuitionFees : {
        required : true,
        type : Number
    },

    uniformFees : {
        required : false,
        type : Number
    },

    lunchFees : {
        required : false,
        type : Number
    },

    boardingOrDay : {
        required : true,
        type : String
    }

});

const modelStudent = async (form) => {
    console.log(`stream is ${form}`);

    const admitStudentModel = await mongoose.model(form, studentSchema);
    return admitStudentModel;
}


module.exports = modelStudent;