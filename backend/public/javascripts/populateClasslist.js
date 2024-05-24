const { StudentMarks } = require("../models/feedStudentMarks");

const populateStudentField = async (stream ,studentData) => {
    try {
          const studentDocs = studentData.map(student => ({
          studentAdmission: student.studentAdmission,
          studentName: student.studentName,
          units: {
            Eng: { subject: 'English', P1: null, P2: null, P3: null },
            Kisw: { subject: 'Kiswahili', P1: null, P2: null, P3: null },
            Maths: { subject: 'Mathematics', P1: null, P2: null, P3: null },
            Chem: { subject: 'Chemistry', P1: null, P2: null, P3: null },
            Bio: { subject: 'Biology', P1: null, P2: null, P3: null },
            Phy: { subject: 'Physics', P1: null, P2: null, P3: null },
            Agri: { subject: 'Agriculture', P1: null, P2: null, P3: null },
            Busn: { subject: 'Business', P1: null, P2: null, P3: null },
            Hist: { subject: 'History', P1: null, P2: null, P3: null },
            Geo: { subject: 'Geography', P1: null, P2: null, P3: null },
            Cre: { subject: 'CRE', P1: null, P2: null, P3: null }
          },
          gender: student.gender,
          stream: stream
        }));
    
        await StudentMarks.insertMany(studentDocs);
      } catch (error) {
        console.error("Error populating student fields:", error);
      } 
}

module.exports = populateStudentField;