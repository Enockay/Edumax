const {fetchStudentsMarks, calculateGradesAndPoints, sortAndRankStudents, calculateMeans} = require('./fetchStudentMarks')
const {generateClassListForm , saveGradedStudents} = require("./pdf");

const generateResults = async (stream, term, Teacher,year,exams,fileName) => {
    try {
        const studentUnits = await fetchStudentsMarks(stream,term,year,exams);
        const gradedStudents = calculateGradesAndPoints(studentUnits, year, term, exams);
        await saveGradedStudents(gradedStudents);
        const sortedAndRankedStudents = sortAndRankStudents(gradedStudents);
        const unitMeans = calculateMeans(sortedAndRankedStudents);
        const classMean = sortedAndRankedStudents.reduce((acc, student) => acc + student.totalPoints, 0) / sortedAndRankedStudents.length;
        const pdfBuffer =   await generateClassListForm(year,stream,term,Teacher,sortedAndRankedStudents, unitMeans, classMean, fileName);
        
        return pdfBuffer
    } catch (error) {
        console.error('Error:', error);
    }
};

module.exports = generateResults
