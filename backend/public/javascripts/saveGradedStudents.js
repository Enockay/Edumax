const {  ProducedResults } = require('../models/feedStudentMarks');

const saveGradedStudents = async (gradedStudents) => {
  // console.log("Graded students:", JSON.stringify(gradedStudents, null, 2));
    try {
        const bulkOps = gradedStudents.map(student => {
            //console.log("Processing student:", student.studentAdmission);

            // Ensure student.years is defined and is an array
            if (!Array.isArray(student.years)) {
              //  console.error('Error: Student years data is invalid:', student);
                return null;
            }

            const yearEntries = student.years.map(year => {
               // console.log("Processing year:", year.year);

                // Ensure year.exams is defined and is an array
                if (!Array.isArray(year.exams)) {
                    console.error('Error: Year exams data is invalid:', year);
                    return null;
                }

                return {
                    year: year.year,
                    exams: year.exams.map(exam => {
                       // console.log("Processing exam:", exam.examType, exam.term);

                        // Ensure exam.units is defined and is an array
                        if (!Array.isArray(exam.units)) {
                            console.error('Error: Exam units data is invalid:', exam);
                            return null;
                        }

                        const units = exam.units.map(unit => {
                           // console.log("Processing unit:", JSON.stringify(unit, null, 2));

                            if (!unit.totalMarks || !unit.points || !unit.grade) {
                              //  console.error('Error: Unit data is incomplete:', unit);
                            }

                            return {
                                subject: unit.subject,
                                P1: unit.P1,
                                P2: unit.P2,
                                P3: unit.P3,
                                totalMarks: unit.totalMarks,
                                points: unit.points,
                                grade: unit.grade
                            };
                        });

                        return {
                            examType: exam.examType,
                            term: exam.term,
                            units: units,
                            totalPoints: exam.totalPoints,
                            totalGrade: exam.totalGrade,
                            totalMarks: exam.totalMarks,
                            classRank : exam.classRank,
                            streamRank : exam.streamRank
                        };
                    }).filter(Boolean) // Filter out null entries
                };
            }).filter(Boolean); // Filter out null entries

            const bulkOp = {
                updateOne: {
                    filter: { studentAdmission: student.studentAdmission },
                    update: {
                        $set: {
                            studentName: student.studentName,
                            gender: student.gender,
                            stream: student.stream,
                            years: yearEntries
                        }
                    },
                    upsert: true
                }
            };

          //  console.log("Bulk operation for student:", JSON.stringify(bulkOp, null, 2));
            return bulkOp;
        }).filter(Boolean); // Filter out null entries

        //console.log("Bulk operations to be executed:", JSON.stringify(bulkOps, null, 2));
        await ProducedResults.bulkWrite(bulkOps);
       // console.log('Graded students saved to database successfully');
    } catch (error) {
        console.error('Error saving graded students:', error);
    }
};


module.exports = saveGradedStudents;
