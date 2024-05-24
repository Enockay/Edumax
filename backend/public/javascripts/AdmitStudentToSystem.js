const modelStudent = require("../models/admitStudentSchema");

const processNewStudent = async (
    fullName,
    guardianName,
    guardianTel,
    admissionNumber,
    stream,
    kcpeIndex,
    kcpeMarks,
    studentBirthNo,
    dateOfAdmission,
    gender,
    formerSchool,
    tuitionFees,
    uniformFees,
    lunchFees,
    boardingOrDay) => {
   try{
     const modeledStudent =  await modelStudent(stream)

     const newStudent = new modeledStudent({
        fullName: fullName,
        guardianName: guardianName,
        guardianTel : guardianTel,
        admissionNumber: admissionNumber,
        stream : stream,
        kcpeIndex: kcpeIndex,
        kcpeMarks: kcpeMarks,
        guardianTel: guardianTel,
        studentBirthNo: studentBirthNo,
        dateOfAdmission: dateOfAdmission,
        gender: gender,
        formerSchool: formerSchool,
        tuitionFees: tuitionFees,
        uniformFees: uniformFees,
        lunchFees: lunchFees,
        boardingOrDay: boardingOrDay,
     })

     const admittedStudent =  await newStudent.save();
     return `successfully addmited student`;
   }catch(error){
      return `error occured while admitting student ${error}`;
   }
}

module.exports = processNewStudent;