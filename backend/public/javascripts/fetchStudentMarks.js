const { StudentMarks } = require("../models/feedStudentMarks");

const fetchStudentsMarks = async (stream, term, year, examType) => {
    const studentUnits = [];

    try {
        let queryStream;

        if (!isNaN(stream)) {
            queryStream = { stream: { $regex: new RegExp(`^${stream}\\D*`, 'i') } };
        } else {
            queryStream = { stream: stream };
        }

        const students = await StudentMarks.find(queryStream);
        const normalizedYear = String(year);

        students.forEach(student => {
            const matchingYears = student.years.filter(y => String(y.year) === normalizedYear);

            matchingYears.forEach(matchingYear => {
                const matchingExams = matchingYear.exams.filter(exam =>
                    exam.term === term && exam.examType === examType
                );

                matchingExams.forEach(exam => {
                    const studentData = {
                        studentAdmission: student.studentAdmission,
                        studentName: student.studentName,
                        gender: student.gender,
                        stream: student.stream,
                        years: [
                            {
                                year: matchingYear.year,
                                exams: [
                                    {
                                        examType: exam.examType,
                                        term: exam.term,
                                        units: exam.units.map(unit => ({
                                            subject: unit.subject,
                                            P1: unit.marks.P1 || null,
                                            P2: unit.marks.P2 || null,
                                            P3: unit.marks.P3 || null,
                                            totalMarks: 0, // Placeholder, will be calculated
                                            points: 0, // Placeholder, will be calculated
                                            grade: '' // Placeholder, will be calculated
                                        })),
                                        totalPoints: 0, // Placeholder, will be calculated
                                        totalGrade: '' // Placeholder, will be calculated
                                    }
                                ]
                            }
                        ]
                    };
                    studentUnits.push(studentData);
                });
            });
        });

    } catch (error) {
        console.error('Error fetching student marks:', error);
        return [];
    }

    return studentUnits;
};

const calculateGradesAndPoints = (studentUnits) => {
    const gradedStudents = studentUnits.map(student => {
        student.years.forEach(yearData => {
            yearData.exams.forEach(exam => {
                // Calculate marks and points for each unit
                exam.units = exam.units.map(unit => {
                    let totalMarks = 0;

                    if (['4East', '4West', '3East', '3West'].includes(student.stream)) {
                        if (['Chemistry', 'Biology', 'Physics'].includes(unit.subject)) {
                            totalMarks = Math.round(((unit.P1 || 0) + (unit.P2 || 0)) / 160 * 60 + (unit.P3 || 0));
                        } else if (['Math', 'Agriculture', 'Business', 'History', 'CRE', 'Geography'].includes(unit.subject)) {
                            totalMarks = Math.round(((unit.P1 || 0) + (unit.P2 || 0)) / 2);
                        } else if (['English', 'Kiswahili'].includes(unit.subject)) {
                            totalMarks = Math.round(((unit.P1 || 0) + (unit.P2 || 0)) / 2 + (unit.P3 || 0));
                        } else {
                            totalMarks = Math.round(unit.P1 || 0);
                        }
                    } else {
                        totalMarks = Math.round(unit.P1 || 0);
                    }

                    let points;
                    let grade;
                    if (totalMarks >= 75) {
                        points = 12;
                        grade = 'A';
                    } else if (totalMarks >= 70) {
                        points = 11;
                        grade = 'A-';
                    } else if (totalMarks >= 66) {
                        points = 10;
                        grade = 'B+';
                    } else if (totalMarks >= 60) {
                        points = 9;
                        grade = 'B';
                    } else if (totalMarks >= 53) {
                        points = 8;
                        grade = 'B-';
                    } else if (totalMarks >= 46) {
                        points = 7;
                        grade = 'C+';
                    } else if (totalMarks >= 40) {
                        points = 6;
                        grade = 'C';
                    } else if (totalMarks >= 35) {
                        points = 5;
                        grade = 'C-';
                    } else if (totalMarks >= 30) {
                        points = 4;
                        grade = 'D+';
                    } else if (totalMarks >= 25) {
                        points = 3;
                        grade = 'D';
                    } else if (totalMarks >= 20) {
                        points = 2;
                        grade = 'D-';
                    } else {
                        points = 1;
                        grade = 'E';
                    }

                    return {
                        ...unit,
                        totalMarks,
                        points,
                        grade
                    };
                });

                // Select the best 7 subjects based on the rules
                const subjects = {
                    languages: [],
                    sciences: [],
                    humanities: [],
                    technicals: []
                };

                exam.units.forEach(unit => {
                    if (['English', 'Kiswahili', 'Math'].includes(unit.subject)) {
                        subjects.languages.push(unit);
                    } else if (['Chemistry', 'Biology', 'Physics'].includes(unit.subject)) {
                        subjects.sciences.push(unit);
                    } else if (['History', 'Geography', 'CRE'].includes(unit.subject)) {
                        subjects.humanities.push(unit);
                    } else if (['Agriculture', 'Business'].includes(unit.subject)) {
                        subjects.technicals.push(unit);
                    }
                });

                // Sort by points descending
                subjects.languages.sort((a, b) => b.points - a.points);
                subjects.sciences.sort((a, b) => b.points - a.points);
                subjects.humanities.sort((a, b) => b.points - a.points);
                subjects.technicals.sort((a, b) => b.points - a.points);

                // Ensure compulsory subjects are included
                const compulsorySubjects = ['English', 'Kiswahili', 'Math'];
                compulsorySubjects.forEach(subject => {
                    if (!subjects.languages.some(unit => unit.subject === subject)) {
                        subjects.languages.push({ subject, points: 1, grade: 'E' });
                    }
                });

                // Apply rules and select units
                let selectedUnits = [];

                // Rule: 3-3-1-0
                if (subjects.languages.length >= 3 && subjects.sciences.length >= 3 && subjects.humanities.length >= 1) {
                    selectedUnits = [
                        ...subjects.languages.slice(0, 3),
                        ...subjects.sciences.slice(0, 3),
                        subjects.humanities[0]
                    ];
                }

                // Rule: 3-2-1-1
                if (subjects.languages.length >= 3 && subjects.sciences.length >= 2 && subjects.humanities.length >= 1 && subjects.technicals.length >= 1) {
                    selectedUnits = [
                        ...subjects.languages.slice(0, 3),
                        ...subjects.sciences.slice(0, 2),
                        subjects.humanities[0],
                        subjects.technicals[0]
                    ];
                }

                // Rule: 3-2-2-0
                if (subjects.languages.length >= 3 && subjects.sciences.length >= 2 && subjects.humanities.length >= 2) {
                    selectedUnits = [
                        ...subjects.languages.slice(0, 3),
                        ...subjects.sciences.slice(0, 2),
                        ...subjects.humanities.slice(0, 2)
                    ];
                }

                // Default selection strategy: Select the best 7 subjects regardless of type if no rule matches
                if (selectedUnits.length < 7) {
                    const allUnits = [
                        ...subjects.languages,
                        ...subjects.sciences,
                        ...subjects.humanities,
                        ...subjects.technicals
                    ].sort((a, b) => b.points - a.points);

                    selectedUnits = allUnits.slice(0, 7);
                }

                exam.totalPoints = selectedUnits.reduce((sum, unit) => sum + unit.points, 0);
                exam.totalGrade = calculateTotalGrade(exam.totalPoints);

                // Debug log
                console.log('Student:', student.studentName, 'Total Points:', exam.totalPoints, 'Total Grade:', exam.totalGrade);
            });
        });

        return student;
    });

    return gradedStudents;
};

const calculateTotalGrade = (totalPoints) => {
    if (totalPoints >= 74) {
        return 'A';
    } else if (totalPoints >= 69) {
        return 'A-';
    } else if (totalPoints >= 66) {
        return 'B+';
    } else if (totalPoints >= 58) {
        return 'B';
    } else if (totalPoints >= 53) {
        return 'B-';
    } else if (totalPoints >= 46) {
        return 'C+';
    } else if (totalPoints >= 40) {
        return 'C';
    } else if (totalPoints >= 36) {
        return 'C-';
    } else if (totalPoints >= 3) {
        return 'D+';
    } else if (totalPoints >= 26) {
        return 'D';
    } else if (totalPoints >= 22) {
        return 'D-';
    } else if (totalPoints >= 19) {
        return 'E';
    } else {
        return 'E';
    }
};

const sortAndRankStudents = (gradedStudents) => {
    const sortedStudents = gradedStudents.slice().sort((a, b) => {
        const totalPointsA = a.years.reduce((sum, year) => sum + year.exams.reduce((sumExams, exam) => sumExams + exam.totalPoints, 0), 0);
        const totalPointsB = b.years.reduce((sum, year) => sum + year.exams.reduce((sumExams, exam) => sumExams + exam.totalPoints, 0), 0);
        return totalPointsB - totalPointsA;
    });

    sortedStudents.forEach((student, index) => {
        student.rank = index + 1;
    });

    return sortedStudents;
};

const calculateMeans = (gradedStudents) => {
    const units = {};

    gradedStudents.forEach(student => {
        student.years.forEach(year => {
            year.exams.forEach(exam => {
                exam.units.forEach(unit => {
                    if (!units[unit.subject]) {
                        units[unit.subject] = {
                            totalMarks: unit.totalMarks,
                            totalPoints: unit.points,
                            count: 1
                        };
                    } else {
                        units[unit.subject].totalMarks += unit.totalMarks;
                        units[unit.subject].totalPoints += unit.points;
                        units[unit.subject].count++;
                    }
                });
                student.classRank = student.rank;
            });
        });
    });

    const unitMeans = {};
    Object.keys(units).forEach(unitName => {
        unitMeans[unitName] = units[unitName].totalMarks / units[unitName].count;
    });

    return unitMeans;
};

module.exports = { fetchStudentsMarks, calculateGradesAndPoints, calculateMeans, sortAndRankStudents };
