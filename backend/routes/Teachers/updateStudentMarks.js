const express = require('express');
const updateStudentMarks = express.Router();
const { StudentMarks } = require("../../public/models/feedStudentMarks");
const ensureAuthenticated = require('./Auth');

updateStudentMarks.put('/students/marks', async (req, res) => {
    const updates = req.body;

    const session = await StudentMarks.startSession();
    session.startTransaction();

    try {
        // First, handle updates where year and examType match
        const bulkOps = updates.map(update => {
            const { id, unit, examType, year, marks } = update;

            return {
                updateOne: {
                    filter: { 
                        _id: id, 
                        [`units.${unit}.exams.year`]: year,
                        [`units.${unit}.exams.examType`]: examType
                    },
                    update: {
                        $set: { 
                            [`units.${unit}.exams.$.marks`]: marks
                        }
                    },
                    upsert: false
                }
            };
        });

        const result = await StudentMarks.bulkWrite(bulkOps, { session });

        // Handle cases where year and examType do not match
        const newExamUpdates = [];
        for (const update of updates) {
            const { id, unit, examType, year, marks } = update;
            
            const existingStudent = await StudentMarks.findById(id).session(session);
            if (existingStudent) {
                const unitData = existingStudent.units[unit];
                if (unitData) {
                    const examExists = unitData.exams.some(exam => exam.year === year && exam.examType === examType);
                    if (!examExists) {
                        newExamUpdates.push({
                            updateOne: {
                                filter: { _id: id },
                                update: {
                                    $push: {
                                        [`units.${unit}.exams`]: { year, examType, marks }
                                    }
                                },
                                upsert: false
                            }
                        });
                    }
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
