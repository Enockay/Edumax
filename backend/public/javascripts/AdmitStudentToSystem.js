const modelStudent = require('../models/admitStudentSchema');

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
    uniformFees,
    boardingOrDay
) => {
    try {
       // console.log('Fetching model for stream:', stream);
        const modeledStudent = await modelStudent(stream);
        //console.log('Model fetched:', modeledStudent);

        const newStudent = new modeledStudent({
            fullName: fullName,
            guardianName: guardianName,
            guardianTel: guardianTel,
            admissionNumber: admissionNumber,
            stream: stream,
            kcpeIndex: kcpeIndex,
            kcpeMarks: kcpeMarks,
            studentBirthNo: studentBirthNo,
            dateOfAdmission: dateOfAdmission,
            gender: gender,
            formerSchool: formerSchool,
            fees: { year: [] },  // Initialize with an empty year array
            uniformFees: uniformFees,
            boardingOrDay: boardingOrDay,
        });

       // console.log('New student data:', newStudent);

        const admittedStudent = await newStudent.save();
        console.log('Admitted student:', admittedStudent);
        return 'Successfully admitted student';
    } catch (error) {
        console.error('Error occurred while admitting student:', error);
        return `Error occurred while admitting student: ${error.message}`;
    }
};

module.exports = processNewStudent;
