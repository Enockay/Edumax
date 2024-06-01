const express = require('express');
const updateStudentMarks = express.Router();
const { StudentMarks } = require("../../public/models/feedStudentMarks");
const ensureAuthenticated = require('./Auth');

updateStudentMarks.put('/students/marks', async (req, res) => {
    const updates = req.body;
    console.log(req.body);
    const session = await StudentMarks.startSession();
    session.startTransaction();

    try {
        const bulkOps = updates.map(update => {
            const { id, unit, examType, year, term, marks } = update;
            return {
                updateOne: {
                    filter: { _id: id, 'years.year': year, 'years.exams.term': term, 'years.exams.examType': examType },
                    update: {
                        $set: { 'years.$[yearElem].exams.$[examElem].units.$[unitElem].marks': marks }
                    },
                    arrayFilters: [
                        { 'yearElem.year': year },
                        { 'examElem.term': term, 'examElem.examType': examType },
                        { 'unitElem.subject': unit }
                    ],
                    upsert: false
                }
            };
        });

        const result = await StudentMarks.bulkWrite(bulkOps, { session });

        const newExamUpdates = [];
        for (const update of updates) {
            const { id, unit, examType, year, term, marks } = update;

            const existingStudent = await StudentMarks.findById(id).session(session);
            if (existingStudent) {
                const yearData = existingStudent.years.find(y => y.year === year);
                if (yearData) {
                    const examExists = yearData.exams.some(exam => exam.term === term && exam.examType === examType);
                    if (!examExists) {
                        newExamUpdates.push({
                            updateOne: {
                                filter: { _id: id, 'years.year': year },
                                update: {
                                    $push: {
                                        'years.$[yearElem].exams': { term, examType, units: [{ subject: unit, marks }] }
                                    }
                                },
                                arrayFilters: [{ 'yearElem.year': year }],
                                upsert: false
                            }
                        });
                    } else {
                        const examData = yearData.exams.find(exam => exam.term === term && exam.examType === examType);
                        const unitExists = examData.units.some(u => u.subject === unit);
                        if (!unitExists) {
                            newExamUpdates.push({
                                updateOne: {
                                    filter: { _id: id, 'years.year': year, 'years.exams.term': term, 'years.exams.examType': examType },
                                    update: {
                                        $push: {
                                            'years.$[yearElem].exams.$[examElem].units': { subject: unit, marks }
                                        }
                                    },
                                    arrayFilters: [
                                        { 'yearElem.year': year },
                                        { 'examElem.term': term, 'examElem.examType': examType }
                                    ],
                                    upsert: false
                                }
                            });
                        }
                    }
                } else {
                    newExamUpdates.push({
                        updateOne: {
                            filter: { _id: id },
                            update: {
                                $push: {
                                    years: { year, exams: [{ term, examType, units: [{ subject: unit, marks }] }] }
                                }
                            },
                            upsert: false
                        }
                    });
                }
            }
        }

        if (newExamUpdates.length > 0) {
            await StudentMarks.bulkWrite(newExamUpdates, { session });
        }

        await session.commitTransaction();
        res.send({
            message: 'Marks updated successfully for all students',
            result: result,
            updatedStudents: updates.map(update => update.id)
        });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).send({
            message: 'Server Error',
            error: error.message
        });
        console.log(error);
    } finally {
        session.endSession();
    }
});

module.exports = updateStudentMarks;
