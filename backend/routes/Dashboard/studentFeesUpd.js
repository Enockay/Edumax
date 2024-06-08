const express = require('express');
const router = express.Router();
const modelStudent = require('../../public/models/admitStudentSchema');

// Fetch student data by stream, admission number, year, and term
router.get('/student/:stream/:admissionNumber/:year/:term', async (req, res) => {
    const { stream, admissionNumber, year, term } = req.params;
  // console.log(req.params);

    try {
        const Student = await modelStudent(stream);
        const student = await Student.findOne({ admissionNumber });
    
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const yearData = student.fees.year.find(y => y.year === year);
        if (!yearData) {
            return res.status(404).json({ message: 'Year not found for the student' });
        }

        const termData = yearData.termfees.find(t => t.term === term);
        if (!termData) {
            return res.status(404).json({ message: 'Term not found for the student' });
        }

        res.json({
            fullName: student.fullName,
            admissionNumber: student.admissionNumber,
            stream: student.stream,
            tuitionFees: termData.tuitionFees,
            uniformFees: termData.uniformFees,
            lunchFees: termData.lunchFees,
            totalLunchFeesToBePaid : termData.totalLunchFeesToBePaid,
            totalTuitionToBePaid : termData.totalTuitionToBePaid,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.post('/student/updateFees', async (req, res) => {
    const { stream, admissionNumber, year, term, levi, amountPaid } = req.body;
    console.log(req.body)
    try {
        const Student = await modelStudent(stream);
        const student = await Student.findOne({ admissionNumber });

        if (!student) {
            return res.status(400).json({ message: 'Student not found' });
        }

        let yearData = student.fees.year.find(y => y.year === year);
        if (!yearData) {
            return res.status(400).json({ message: 'Year not found for the student' });
        }

        let termData = yearData.termfees.find(t => t.term === term);
        if (!termData) {
            return res.status(400).json({ message: 'Term not found for the student' });
        }

        switch (levi) {
            case 'tuition':
                termData.tuitionFees -= amountPaid;
                break;
            case 'uniform':
                termData.uniformFees -= amountPaid;
                break;
            case 'lunch':
                termData.lunchFees -= amountPaid;
                break;
            default:
                return res.status(400).json({ message: 'Invalid levi type' });
        }

        termData.payments.push({ date: new Date(), amount: amountPaid, levi });

        await student.save();

        res.json({
            message: 'Fees updated successfully',
            fullName: student.fullName,
            admissionNumber: student.admissionNumber,
            levi,
            updatedBalance: {
                tuitionFees: termData.tuitionFees,
                uniformFees: termData.uniformFees,
                lunchFees: termData.lunchFees
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Set total fees for all students
router.post('/setTotalFees', async (req, res) => {
    const { year,Term,tuition, lunch } = req.body;
    console.log(year,Term,tuition,lunch);

    try {
        const streams = ['1East', '1West', '2East', '2West', '3East', '3West', '4East', '4West'];
        for(const stream of streams){
            const Student = await modelStudent(stream);
            const students = await Student.find();
        
        for (const student of students) {
            let yearData = student.fees.year.find(y => y.year === year);
            if (!yearData) {
                yearData = { year, termfees: [] };
                student.fees.year.push(yearData);
            }

            let termData = yearData.termfees.find(t => t.term === Term);
            if (!termData) {
                termData = {
                    Term,
                    totalTuitionToBePaid: tuition,
                    totalLunchFeesToBePaid: lunch,
                    tuitionFees: tuition,
                    lunchFees: lunch,
                    payments: []
                };
                yearData.termfees.push(termData);
            } else {
                termData.totalTuitionToBePaid = tuition;
                termData.totalLunchFeesToBePaid = lunch;
                termData.tuitionFees = tuition;
                termData.lunchFees = lunch;
            }

            await student.save();
        }
    }
        res.json({ message: 'Total fees set successfully for all students' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Fetch student details by admission number
router.get('/students/:admissionNumber', async (req, res) => {
    const { admissionNumber } = req.params;

    try {
        const streams = ['1East', '1West', '2East', '2West', '3East', '3West', '4East', '4West'];

        for (const stream of streams) {
            const Student = await modelStudent(stream);
            const student = await Student.findOne({ admissionNumber });

            if (student) {
                console.log(student);
                return res.json(student);
            }
        }

        res.status(404).json({ message: 'Student not found' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Admit new student and set their fees
router.post('/students/admit', async (req, res) => {
    const { admissionNumber, name, stream, year, term, tuition, uniform, lunch } = req.body;
    console.log(req.body);

    try {
        const Student = await modelStudent(stream);

        const student = await Student.findOne({ admissionNumber });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        const yearIndex = student.fees.year.findIndex(y => y.year === year);

        if (yearIndex === -1) {
            // Year does not exist, push a new year object
            student.fees.year.push({
                year: year,
                termfees: [{
                    term: term,
                    totalTuitionToBePaid: tuition,
                    totalUniformFeesToBePaid: uniform,
                    totalLunchFeesToBePaid: lunch,
                    tuitionFees: tuition,
                    uniformFees: uniform,
                    lunchFees: lunch,
                    payments: []
                }]
            });
        } else {
            // Year exists, check if the term exists
            const termIndex = student.fees.year[yearIndex].termfees.findIndex(t => t.term === term);

            if (termIndex === -1) {
                // Term does not exist, push a new term object
                student.fees.year[yearIndex].termfees.push({
                    term: term,
                    totalTuitionToBePaid: tuition,
                    totalUniformFeesToBePaid: uniform,
                    totalLunchFeesToBePaid: lunch,
                    tuitionFees: tuition,
                    uniformFees: uniform,
                    lunchFees: lunch,
                    payments: []
                });
            } else {
                // Term exists, update the existing term fees
                student.fees.year[yearIndex].termfees[termIndex].totalTuitionToBePaid = tuition;
                student.fees.year[yearIndex].termfees[termIndex].totalUniformFeesToBePaid = uniform;
                student.fees.year[yearIndex].termfees[termIndex].totalLunchFeesToBePaid = lunch;
                student.fees.year[yearIndex].termfees[termIndex].tuitionFees = tuition;
                student.fees.year[yearIndex].termfees[termIndex].uniformFees = uniform;
                student.fees.year[yearIndex].termfees[termIndex].lunchFees = lunch;
            }
        }

        // Save the updated student document
        await student.save();

        res.json({ message: 'New student admitted  To Finance Procced To Pay Fees' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;

