const mongoose = require('mongoose');
const { StudentMarks } = require("../models/feedStudentMarks");

const fetchStudentsMarks = async (stream) => {
    const studentUnit = [];

    try {
        let queryStream;

        // Determine if the stream is a single number or a string
        if (!isNaN(stream)) {
            // If it's a single number, use a regular expression to match streams including that number
            queryStream = { stream: { $regex: new RegExp(`^${stream}\\D*`, 'i') } };
        } else {
            // If it's a string, match the stream exactly
            queryStream = { stream: stream };
        }

        const StudentOfThatStream = await StudentMarks.find(queryStream);

        StudentOfThatStream.forEach(student => {
            const units = Object.keys(student.units).map(unitName => {
                const unit = student.units[unitName];
                if (unit) {
                    return { name: unitName, ...unit.toObject() };
                }
                return null;
            }).filter(unit => unit !== null);

            studentUnit.push({
                studentAdmission: student.studentAdmission,
                studentName: student.studentName,
                gender: student.gender,
                stream: student.stream,
                units: units
            });
        });

    } catch (errors) {
        console.error(errors);
        return [];
    }

    return studentUnit;
};


const calculateGradesAndPoints = (studentUnits) => {
    const gradedStudents = studentUnits.map(student => {
        const { units, stream } = student;
        let totalPoints = 0;

        // Calculate total marks and points for each unit
        student.units = units.map(unit => {
            let totalMarks = 0;
            let points = 0;
            let grade = '';

            if (['4East', '4West', '3East', '3West'].includes(stream)) {
                if (['Chem', 'Bio', 'Phy'].includes(unit.name)) {
                    totalMarks = Math.round(((unit.P1 || 0) + (unit.P2 || 0)) / 160 * 60 + (unit.P3 || 0));
                } else if (['Maths', 'Agri', 'Busn', 'Hist', 'CRE', 'Geo'].includes(unit.name)) {
                    totalMarks = Math.round(((unit.P1 || 0) + (unit.P2 || 0)) / 2);
                } else if (['Eng', 'Kisw'].includes(unit.name)) {
                    totalMarks = Math.round(((unit.P1 || 0) + (unit.P2 || 0)) / 2 + (unit.P3 || 0));
                } else {
                    totalMarks = Math.round(unit.P1 || 0);
                }
            } else {
                totalMarks = Math.round(unit.P1 || 0);
            }

            // Calculate points and grades based on the total marks
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

        // Subject categories
        const compulsorySubjects = ['Eng', 'Kisw', 'Maths'];
        const scienceSubjects = ['Chem', 'Bio', 'Phy'];
        const humanitiesSubjects = ['Geog', 'Hist', 'CRE'];
        const technicalSubjects = ['Busn', 'Agri'];

        // Calculate points for compulsory subjects
        const compulsoryPoints = student.units
            .filter(unit => compulsorySubjects.includes(unit.name))
            .reduce((sum, unit) => sum + unit.points, 0);

        // Select top 3 sciences
        const selectedSciences = student.units
            .filter(unit => scienceSubjects.includes(unit.name))
            .sort((a, b) => b.points - a.points)
            .slice(0, 3);

        const sciencePoints = selectedSciences.reduce((sum, unit) => sum + unit.points, 0);

        // Select top humanity (ensure at least one humanity is included)
        let selectedHumanity = student.units
            .filter(unit => humanitiesSubjects.includes(unit.name))
            .sort((a, b) => b.points - a.points)
            .slice(0, 1);

        if (selectedHumanity.length === 0) {
            // Ensure at least one humanity is included, even if it has zero points
            selectedHumanity = student.units
                .filter(unit => humanitiesSubjects.includes(unit.name))
                .sort((a, b) => a.name.localeCompare(b.name)) // Arbitrary order if none present
                .slice(0, 1);
        }

        const humanityPoints = selectedHumanity.reduce((sum, unit) => sum + unit.points, 0);

        // Calculate points for remaining units to follow 3-3-1-0, 3-2-1-1, or 3-2-2-0 pattern
        const remainingUnits = student.units.filter(unit => !compulsorySubjects.includes(unit.name) && !selectedSciences.includes(unit) && !selectedHumanity.includes(unit));

        remainingUnits.sort((a, b) => b.points - a.points);

        // Select up to 1 additional technical subject to make up 3-3-1-0 pattern
        let remainingPoints = 0;
        const selectedTechnicals = remainingUnits
            .filter(unit => technicalSubjects.includes(unit.name))
            .slice(0, 1);

        if (selectedTechnicals.length > 0) {
            remainingPoints += selectedTechnicals.reduce((sum, unit) => sum + unit.points, 0);
            remainingUnits.splice(remainingUnits.indexOf(selectedTechnicals[0]), 1);
        }

        // If 3-3-1-0 pattern is not satisfied, consider remaining units for 3-2-1-1 or 3-2-2-0 patterns
        if (selectedSciences.length < 3) {
            const additionalSciences = remainingUnits
                .filter(unit => scienceSubjects.includes(unit.name))
                .slice(0, 3 - selectedSciences.length);

            if (additionalSciences.length > 0) {
                remainingPoints += additionalSciences.reduce((sum, unit) => sum + unit.points, 0);
                additionalSciences.forEach(unit => {
                    remainingUnits.splice(remainingUnits.indexOf(unit), 1);
                });
            }
        }

        if (selectedHumanity.length < 2) {
            const additionalHumanities = remainingUnits
                .filter(unit => humanitiesSubjects.includes(unit.name))
                .slice(0, 2 - selectedHumanity.length);

            if (additionalHumanities.length > 0) {
                remainingPoints += additionalHumanities.reduce((sum, unit) => sum + unit.points, 0);
                additionalHumanities.forEach(unit => {
                    remainingUnits.splice(remainingUnits.indexOf(unit), 1);
                });
            }
        }

        // Select up to 1 remaining subject to make up 7 subjects in total
        if (selectedSciences.length + selectedHumanity.length + selectedTechnicals.length < 7) {
            remainingPoints += remainingUnits.slice(0, 1).reduce((sum, unit) => sum + unit.points, 0);
        }

        totalPoints = compulsoryPoints + sciencePoints + humanityPoints + remainingPoints;

        // Assign grade based on total points
        let totalGrade = '';
        if (totalPoints >= 70) {
            totalGrade = 'A';
        } else if (totalPoints >= 68) {
            totalGrade = 'A-';
        } else if (totalPoints >= 66) {
            totalGrade = 'B+';
        } else if (totalPoints >= 58) {
            totalGrade = 'B';
        } else if (totalPoints >= 53) {
            totalGrade = 'B-';
        } else if (totalPoints >= 46) {
            totalGrade = 'C+';
        } else if (totalPoints >= 40) {
            totalGrade = 'C';
        } else if (totalPoints >= 35) {
            totalGrade = 'C-';
        } else if (totalPoints >= 30) {
            totalGrade = 'D+';
        } else if (totalPoints >= 26) {
            totalGrade = 'D';
        } else if (totalPoints >= 20) {
            totalGrade = 'D-';
        } else {
            totalGrade = 'E';
        }

        student.totalPoints = totalPoints;
        student.totalGrade = totalGrade;

        return student;
    });

    return gradedStudents;
};


const sortAndRankStudents = (gradedStudents) => {
    const sortedStudents = gradedStudents.slice().sort((a, b) => b.totalPoints - a.totalPoints);

    sortedStudents.forEach((student, index) => {
        student.rank = index + 1;
    });

    return sortedStudents;
};

const calculateMeans = (gradedStudents) => {
    const units = {};
    gradedStudents.forEach(student => {
        student.units.forEach(unit => {
            if (!units[unit.name]) {
                units[unit.name] = {
                    totalMarks: unit.totalMarks,
                    totalPoints: unit.points,
                    count: 1
                };
            } else {
                units[unit.name].totalMarks += unit.totalMarks;
                units[unit.name].totalPoints += unit.points;
                units[unit.name].count++;
            }
        });
        student.classRank = student.rank
    });

    const unitMeans = {};
    Object.keys(units).forEach(unitName => {
        unitMeans[unitName] = units[unitName].totalMarks / units[unitName].count;
    });

    return unitMeans;
};

module.exports = { fetchStudentsMarks, calculateGradesAndPoints, sortAndRankStudents, calculateMeans };
