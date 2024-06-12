const {fetchStudentsMarks, calculateGradesAndPoints, sortAndRankStudents, calculateMeans} = require('./fetchStudentMarks')
const generateClassListForm  = require("./pdf");
const saveGradedStudents  = require("./saveGradedStudents");

const generateResults = async (stream, term, Teacher,year,exams,fileName) => {
    console.log("file name atgenerate result",fileName)
    try {
        const studentUnits = await fetchStudentsMarks(stream,term,year,exams);
        const gradedStudents = calculateGradesAndPoints(studentUnits, year, term, exams);
        const sortedAndRankedStudents = sortAndRankStudents(gradedStudents);
        await saveGradedStudents(sortedAndRankedStudents);
        const unitMeans = calculateMeans(sortedAndRankedStudents);
        const classMean = sortedAndRankedStudents.reduce((acc, student) => acc + student.totalPoints, 0) / sortedAndRankedStudents.length;
        const pdfBuffer =   await generateClassListForm(year,stream,term,Teacher,sortedAndRankedStudents, unitMeans, classMean, fileName,exams);
         
        return pdfBuffer;

    } catch (error) {
        console.error('Error:', error);
    }
};

module.exports = generateResults
