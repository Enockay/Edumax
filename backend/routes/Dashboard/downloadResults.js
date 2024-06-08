const express = require('express');
const ClassModel = require('../../public/models/pdfSchema'); // Import the ClassModel

const downloadResults = express.Router();

downloadResults.get('/:year/:term/:examType/:fileName/:stream', async (req, res) => {
    const { year, term, examType, fileName, stream } = req.params;
    //console.log(req.params)

    try {
        // Find the class document containing the requested PDF
        const classDoc = await ClassModel.findOne({
            'class': stream,
            'years.year': year,
            'years.terms.term': term,
            'years.terms.examTypes.examType': examType,
            'years.terms.examTypes.pdf.fileName': fileName
        });

        if (!classDoc) {
            console.log('PDF not found in database');
            return res.status(400).send('Results not Found In the Database Maybe not generated');
        }

        let pdf;

        // Traverse the hierarchy to find the specific PDF
        for (const y of classDoc.years) {
            if (y.year === year) {
                for (const t of y.terms) {
                    if (t.term === term) {
                        for (const e of t.examTypes) {
                            if (e.examType === examType && e.pdf.fileName === fileName) {
                                pdf = e.pdf;
                                break;
                            }
                        }
                        if (pdf) break;
                    }
                }
                if (pdf) break;
            }
        }

        if (!pdf || !pdf.contentType || !pdf.data) {
            console.log('PDF missing required fields');
            return res.status(500).send('Internal Server Error: PDF is missing required fields');
        }

        res.setHeader('Content-Type', pdf.contentType);
        res.setHeader('Content-Disposition', `attachment; filename=${pdf.fileName}`);
        res.send(pdf.data);
    } catch (error) {
        console.error('Error fetching PDF:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = downloadResults;
