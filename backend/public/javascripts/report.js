const mongoose = require('mongoose');

const changedSchema = mongoose.Schema({
    admissionNumber : {
        required : true,
        type : Number
   },

    fullName : {
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
    }

   

});


const report = (changed) => {
    
}

module.exports = report