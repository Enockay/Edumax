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
                                        totalMarks: 0, // Placeholder, will be calculated
                                        totalGrade: '',
                                        classRank: null, // This will be updated
                                        streamRank: null, // This will be updated
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
                // Process each unit
                exam.units = exam.units.map(unit => {
                    let totalMarks = 0;

                    if (['4East', '4West', '3East', '3West'].includes(student.stream)) {
                        if (['Chem', 'Bio', 'Phys'].includes(unit.subject)) {
                            totalMarks = Math.round(((unit.P1 || 1) + (unit.P2 || 1)) / 160 * 60 + (unit.P3 || 1));
                        } else if (['Math', 'Agri', 'Busn', 'Hist', 'CRE', 'Geo'].includes(unit.subject)) {
                            totalMarks = Math.round(((unit.P1 || 1) + (unit.P2 || 1)) / 2);
                        } else if (['Eng', 'Kisw'].includes(unit.subject)) {
                            totalMarks = Math.round(((unit.P1 || 1) + (unit.P2 || 1)) / 2 + (unit.P3 || 1));
                        } else {
                            totalMarks = Math.round(unit.P1 || 1);
                        }
                    } else {
                        totalMarks = Math.round(unit.P1 || 1);
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

                // Abbreviate subject names
                exam.units.forEach(unit => {
                    unit.subject = abbreviateSubject(unit.subject);
                });

                // Add compulsory subjects if missing
                const compulsorySubjects = ['Eng', 'Kisw', 'Math'];
                const allUnits = [...exam.units];
                compulsorySubjects.forEach(subject => {
                    if (!allUnits.some(unit => unit.subject === subject)) {
                        allUnits.push({ subject, points: 1, grade: 'E', totalMarks: 0 });
                    }
                });

                allUnits.sort((a, b) => b.points - a.points);

                const minimumSubjects = (units, subjectList, count) => {
                    const selected = units.filter(unit => subjectList.includes(unit.subject)).slice(0, count);
                    while (selected.length < count) {
                        selected.push({ subject: `${subjectList[0]} Placeholder`, points: 1, grade: 'E', totalMarks: 0 });
                    }
                    return selected;
                };

                let selectedLanguages = minimumSubjects(allUnits, ['Eng', 'Kisw', 'Math'], 3);
                let selectedSciences = minimumSubjects(allUnits, ['Chem', 'Bio', 'Phys'], 2);
                let selectedHumanities = minimumSubjects(allUnits, ['Hist', 'Geo', 'CRE'], 1);

                const createCombination = (languages, sciences, humanities, technicials, allUnits) => {
                    return [...languages, ...sciences, ...humanities, ...technicials].concat(
                        allUnits.filter(unit => ![...languages, ...sciences, ...humanities, ...technicials].includes(unit)).slice(0, 7 - (languages.length + sciences.length + humanities.length + technicials.length))
                    );
                };

                let combinations = [
                    {
                        rule: '3-3-1-0',
                        units: createCombination(
                            selectedLanguages,
                            minimumSubjects(allUnits, ['Chem', 'Bio', 'Phys'], 3),
                            minimumSubjects(allUnits, ['Hist', 'Geo', 'CRE'], 1),
                            [],
                            allUnits
                        )
                    },
                    {
                        rule: '3-2-1-1',
                        units: createCombination(
                            selectedLanguages,
                            selectedSciences,
                            selectedHumanities,
                            minimumSubjects(allUnits, ['Agri', 'Busn', 'Comp'], 1),
                            allUnits
                        )
                    },
                    {
                        rule: '3-2-2-0',
                        units: createCombination(
                            selectedLanguages,
                            selectedSciences,
                            minimumSubjects(allUnits, ['Hist', 'Geo', 'CRE'], 2),
                            [],
                            allUnits
                        )
                    }
                ];

                // Calculate total points for each combination
                combinations.forEach(combination => {
                    combination.totalPoints = combination.units.reduce((sum, unit) => sum + unit.points, 0);
                });

                // Select the best combination based on total points
                let bestCombination = combinations.reduce((best, current) => current.totalPoints > best.totalPoints ? current : best);

                // Sort the selected units according to a desired order
                const desiredOrder = ['Eng', 'Kisw', 'Math', 'Chem', 'Bio', 'Phys', 'Geo', 'Hist', 'Agri', 'Busn', 'CRE', 'Comp'];
                bestCombination.units.sort((a, b) => desiredOrder.indexOf(a.subject) - desiredOrder.indexOf(b.subject));
                //console.log(bestCombination)
                // Calculate total marks from the best chosen combination
                exam.totalPoints = bestCombination.totalPoints;
                exam.totalMarks = bestCombination.units.reduce((sum, unit) => sum + unit.totalMarks, 0);
                exam.totalGrade = calculateTotalGrade(exam.totalPoints);
            });
        });

        return student;
    });

    return gradedStudents;
};

// Ensure that the abbreviation function and total grade calculation are present
const abbreviateSubject = (subject) => {
    const abbreviations = {
        'English': 'Eng',
        'Kiswahili': 'Kisw',
        'Mathematics': 'Math',
        'Chemistry': 'Chem',
        'Biology': 'Bio',
        'Physics': 'Phys',
        'Geography': 'Geo',
        'History': 'Hist',
        'Agriculture': 'Agri',
        'Business': 'Busn',
        'CRE': 'CRE',
        'Computer': 'Comp'
    };

    return abbreviations[subject] || subject;
};

const calculateTotalGrade = (totalPoints) => {
    if (totalPoints >= 74) {
        return 'A';
    } else if (totalPoints >= 67) {
        return 'A-';
    } else if (totalPoints >= 66) {
        return 'B+';
    } else if (totalPoints >= 57) {
        return 'B';
    } else if (totalPoints >= 53) {
        return 'B-';
    } else if (totalPoints >= 46) {
        return 'C+';
    } else if (totalPoints >= 40) {
        return 'C';
    } else if (totalPoints >= 36) {
        return 'C-';
    } else if (totalPoints >= 30) {
        return 'D+';
    } else if (totalPoints >= 26) {
        return 'D';
    } else if (totalPoints >= 22) {
        return 'D-';
    } else {
        return 'E';
    }
};

const sortAndRankStudents = (gradedStudents) => {
    // Assign overall class rank
    gradedStudents.sort((a, b) => b.years[0].exams[0].totalPoints - a.years[0].exams[0].totalPoints);

    let currentRank = 1;
    const totalStudents = gradedStudents.length;

    for (let i = 0; i < gradedStudents.length; i++) {
        if (i > 0 && gradedStudents[i].years[0].exams[0].totalPoints < gradedStudents[i - 1].years[0].exams[0].totalPoints) {
            currentRank = i + 1;
        }

        gradedStudents[i].years.forEach(year => {
            year.exams.forEach(exam => {
                exam.classRank = `${currentRank} out of ${totalStudents}`;
            });
        });

        // Adjust the current rank for the next iteration
        while (i + 1 < gradedStudents.length && gradedStudents[i + 1].years[0].exams[0].totalPoints === gradedStudents[i].years[0].exams[0].totalPoints) {
            i++;
            gradedStudents[i].years.forEach(year => {
                year.exams.forEach(exam => {
                    exam.classRank = `${currentRank} out of ${totalStudents}`;
                });
            });
        }
        currentRank = i + 2;
    }

    // Group students by stream and rank within each stream
    const studentsByStream = gradedStudents.reduce((acc, student) => {
        if (!acc[student.stream]) {
            acc[student.stream] = [];
        }
        acc[student.stream].push(student);
        return acc;
    }, {});

    Object.keys(studentsByStream).forEach(stream => {
        const streamStudents = studentsByStream[stream];

        // Sort the students by total points in descending order
        streamStudents.sort((a, b) => b.years[0].exams[0].totalPoints - a.years[0].exams[0].totalPoints);

        let currentStreamRank = 1;

        for (let i = 0; i < streamStudents.length; i++) {
            if (i > 0 && streamStudents[i].years[0].exams[0].totalPoints < streamStudents[i - 1].years[0].exams[0].totalPoints) {
                currentStreamRank = i + 1;
            }

            streamStudents[i].years.forEach(year => {
                year.exams.forEach(exam => {
                    exam.streamRank = `${currentStreamRank} out of ${streamStudents.length}`;
                });
            });

            // Adjust the current stream rank for the next iteration
            while (i + 1 < streamStudents.length && streamStudents[i + 1].years[0].exams[0].totalPoints === streamStudents[i].years[0].exams[0].totalPoints) {
                i++;
                streamStudents[i].years.forEach(year => {
                    year.exams.forEach(exam => {
                        exam.streamRank = `${currentStreamRank} out of ${streamStudents.length}`;
                    });
                });
            }
            currentStreamRank = i + 2;
        }
    });

    return gradedStudents;
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
            });
        });
    });

    const unitMeans = {};
    Object.keys(units).forEach(unitName => {
        unitMeans[unitName] = units[unitName].totalMarks / units[unitName].count;
    });

    return unitMeans;
};


module.exports = { fetchStudentsMarks, calculateMeans, sortAndRankStudents ,calculateGradesAndPoints};
