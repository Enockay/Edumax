const express = require("express");
const app = express.Router();
const { StudentMarks } = require("../../public/models/feedStudentMarks");
const { PDFDocument } = require('pdf-lib');
const stream = require('stream');

app.get('/download-report', async (req, res) => {
    const { year, term, stream: studentStream, examType } = req.query;
    console.log(req.query);

    try {
        const PAGE_SIZE = 50; // Number of students to process per page
        let page = 0;
        let moreStudents = true;

        // Create a new PDF document to combine all individual PDFs
        const pdfDoc = await PDFDocument.create();

        while (moreStudents) {
            const students = await StudentMarks.find({
                'years.year': year,
                stream: studentStream,
                'years.exams.term': term,
                'years.exams.examType': examType,
            }, { 'years.$': 1, _id: 1 }) // Only fetch relevant years and the student's ID
            .skip(page * PAGE_SIZE)
            .limit(PAGE_SIZE);

            if (students.length === 0) {
                moreStudents = false;
            } else {
                await Promise.all(students.map(async (student) => {
                    const yearData = student.years.find(y => y.year === year);
                    if (yearData) {
                        await Promise.all(yearData.exams.map(async (exam) => {
                            if (exam.term === term && exam.examType === examType) {
                                const pdfBytes = exam.pdf;
                                if (pdfBytes) {
                                    const existingPdfDoc = await PDFDocument.load(pdfBytes);
                                    const copiedPages = await pdfDoc.copyPages(existingPdfDoc, existingPdfDoc.getPageIndices());
                                    copiedPages.forEach((page) => pdfDoc.addPage(page));
                                }
                            }
                        }));
                    }
                }));
                page += 1;
            }
        }

        // Serialize the PDF to bytes (a Uint8Array)
        const finalPdfBytes = await pdfDoc.save();

        // Stream the PDF to the response
        const readStream = new stream.PassThrough();
        readStream.end(Buffer.from(finalPdfBytes));

        res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        readStream.pipe(res);

    } catch (error) {
        res.status(500).send('Error generating report: ' + error.message);
        console.log(error);
    }
});

module.exports = app;
