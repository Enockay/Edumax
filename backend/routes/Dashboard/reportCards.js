const express = require("express");
const router = express.Router();
const { ProducedResults } = require("../../public/models/feedStudentMarks");
const { PDFDocument } = require('pdf-lib');
const stream = require('stream');

router.get('/download-report', async (req, res) => {
    const { year, term, stream: studentStream, examType } = req.query;
    console.log(req.query);

    try {
        const PAGE_SIZE = 50; // Number of students to process per page
        let page = 0;
        let moreStudents = true;

        // Create a new PDF document to combine all individual PDFs
        const pdfDoc = await PDFDocument.create();

        while (moreStudents) {
            const students = await ProducedResults.find({
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
                    //console.log("student  year",yearData);
                    if (yearData) {
                        const exam = yearData.exams.find(e => e.term === term && e.examType === examType);
                        //console.log("student exams",exam)
                        if (exam && exam.pdf) {
                            const existingPdfDoc = await PDFDocument.load(exam.pdf);
                            const copiedPages = await pdfDoc.copyPages(existingPdfDoc, existingPdfDoc.getPageIndices());
                            copiedPages.forEach((page) => pdfDoc.addPage(page));
                        }
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

module.exports = router;
