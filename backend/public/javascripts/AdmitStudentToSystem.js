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
        const modeledStudent = await modelStudent(stream);

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

        const admittedStudent = await newStudent.save();
        return 'Successfully admitted student';
    } catch (error) {
        return `Error occurred while admitting student: ${error.message}`;
    }
};

module.exports = processNewStudent;
