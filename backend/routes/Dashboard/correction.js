const express = require('express');
const mongoose = require('mongoose');
const { launchPuppeteer } = require('../../puppeteerConfig');
const path = require('path');

const { StudentMarks } = require('../../public/models/feedStudentMarks'); // Adjust the path if necessary

const router = express.Router();

router.post('/CorrectionSheet', async (req, res) => {
    const { year, term, stream, examType } = req.body;

    // Abbreviations for subjects
    const subjectAbbreviations = {
        "English": "Eng",
        "Kiswahili": "Kisw",
        "Mathematics": "Math",
        "Biology": "Bio",
        "Chemistry": "Chem",
        "Physics": "Phyc",
        "History": "Hist",
        "Geography": "Geog",
        "Agriculture": "Agri",
        "Business": "Bus",
        "CRE": "Cre"
    };

    try {
        const students = await StudentMarks.find({ 'years.year': year, stream });

        const browser = await launchPuppeteer();
        const page = await browser.newPage();

        const generateHeaders = () => {
            if (stream.startsWith('3') && term === 'Term 3') {
                return `
                    <th>${subjectAbbreviations["English"]}</th>
                    <th>${subjectAbbreviations["English"]} P1</th>
                    <th>${subjectAbbreviations["English"]} P2</th>
                    <th>${subjectAbbreviations["English"]} P3</th>
                    <th>${subjectAbbreviations["Kiswahili"]}</th>
                    <th>${subjectAbbreviations["Kiswahili"]} P1</th>
                    <th>${subjectAbbreviations["Kiswahili"]} P2</th>
                    <th>${subjectAbbreviations["Kiswahili"]} P3</th>
                    <th>${subjectAbbreviations["Mathematics"]}</th>
                    <th>${subjectAbbreviations["Mathematics"]} P1</th>
                    <th>${subjectAbbreviations["Mathematics"]} P2</th>
                    <th>${subjectAbbreviations["Biology"]}</th>
                    <th>${subjectAbbreviations["Biology"]} P1</th>
                    <th>${subjectAbbreviations["Biology"]} P2</th>
                    <th>${subjectAbbreviations["Biology"]} P3</th>
                    <th>${subjectAbbreviations["Chemistry"]}</th>
                    <th>${subjectAbbreviations["Chemistry"]} P1</th>
                    <th>${subjectAbbreviations["Chemistry"]} P2</th>
                    <th>${subjectAbbreviations["Chemistry"]} P3</th>
                    <th>${subjectAbbreviations["Physics"]}</th>
                    <th>${subjectAbbreviations["Physics"]} P1</th>
                    <th>${subjectAbbreviations["Physics"]} P2</th>
                    <th>${subjectAbbreviations["Physics"]} P3</th>
                    <th>${subjectAbbreviations["History"]}</th>
                    <th>${subjectAbbreviations["History"]} P1</th>
                    <th>${subjectAbbreviations["History"]} P2</th>
                    <th>${subjectAbbreviations["History"]} P3</th>
                    <th>${subjectAbbreviations["Geography"]}</th>
                    <th>${subjectAbbreviations["Geography"]} P1</th>
                    <th>${subjectAbbreviations["Geography"]} P2</th>
                    <th>${subjectAbbreviations["Geography"]} P3</th>
                    <th>${subjectAbbreviations["Agriculture"]}</th>
                    <th>${subjectAbbreviations["Agriculture"]} P1</th>
                    <th>${subjectAbbreviations["Agriculture"]} P2</th>
                    <th>${subjectAbbreviations["Business"]}</th>
                    <th>${subjectAbbreviations["Business"]} P1</th>
                    <th>${subjectAbbreviations["Business"]} P2</th>
                    <th>${subjectAbbreviations["CRE"]}</th>
                    <th>${subjectAbbreviations["CRE"]} P1</th>
                    <th>${subjectAbbreviations["CRE"]} P2</th>
                `;
            } else {
                return `
                    <th>${subjectAbbreviations["English"]}</th>
                    <th>${subjectAbbreviations["Kiswahili"]}</th>
                    <th>${subjectAbbreviations["Mathematics"]}</th>
                    <th>${subjectAbbreviations["Biology"]}</th>
                    <th>${subjectAbbreviations["Chemistry"]}</th>
                    <th>${subjectAbbreviations["Physics"]}</th>
                    <th>${subjectAbbreviations["History"]}</th>
                    <th>${subjectAbbreviations["Geography"]}</th>
                    <th>${subjectAbbreviations["Agriculture"]}</th>
                    <th>${subjectAbbreviations["Business"]}</th>
                    <th>${subjectAbbreviations["CRE"]}</th>
                `;
            }
        };

        const generateRows = (student, exam) => {
            if (stream.startsWith('3') && term === 'Term 3') {
                return `
                    <td>${student.studentAdmission}</td>
                    <td>${student.studentName}</td>
                    ${["English", "Kiswahili", "Mathematics", "Biology", "Chemistry", "Physics", "History", "Geography", "Agriculture", "Business", "Christian Religious Education"].map(subject => {
                        const unit = exam.units.find(unit => unit.subject === subject);
                        if (["Agriculture", "Business", "CRE", "Mathematics"].includes(subject)) {
                            return `
                                <td>${unit ? unit.marks.P1 || '--' : '--'}</td>
                                <td>${unit ? unit.marks.P2 || '--' : '--'}</td>
                            `;
                        } else {
                            return `
                                <td>${unit ? unit.marks.P1 || '--' : '--'}</td>
                                <td>${unit ? unit.marks.P2 || '--' : '--'}</td>
                                <td>${unit ? unit.marks.P3 || '--' : '--'}</td>
                            `;
                        }
                    }).join('')}
                    <td></td>
                    <td></td>
                `;
            } else {
                return `
                    <td>${student.studentAdmission}</td>
                    <td>${student.studentName}</td>
                    ${["English", "Kiswahili", "Mathematics", "Biology", "Chemistry", "Physics", "History", "Geography", "Agriculture", "Business", "CRE"].map(subject => {
                        const unit = exam.units.find(unit => unit.subject === subject);
                        return `
                            <td>${unit ? unit.marks.P1 || '--' : '--'}</td>
                        `;
                    }).join('')}
                    <td></td>
                    <td></td>
                `;
            }
        };

        const content = `
    <html>
    <head>
        <style>
            @page {
                size: landscape;
            }
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
            }
            .outer-frame {
                border: 2px solid #000;
                padding: 10px;
            }
            .inner-frame {
                border: 1px solid #000;
                padding: 10px;
            }
            .container {
                width: 100%;
                padding: 10px;
            }
            .header {
                text-align: center;
                margin-bottom: 10px;
            }
            .header h1 {
                margin: 0;
            }
            .content {
                margin-top: 10px;
            }
            .content table {
                width: 100%;
                border-collapse: collapse;
            }
            .content th, .content td {
                border: 1px solid #ddd;
                padding: 5px;
            }
            .content th {
                background-color: #f2f2f2;
                text-align: left;
            }
            .footer {
                text-align: center;
                margin-top: 10px;
            }
        </style>
    </head>
    <body>
        <div class="outer-frame">
            <div class="inner-frame">
                <div class="container">
                    <div class="header">
                        <h1>Correction Sheet</h1>
                        <p>${stream} - ${term} - ${examType} - ${year}</p>
                    </div>
                    <div class="content">
                        <table>
                            <tr>
                                <th>ADM</th>
                                <th>Student Name</th>
                                ${generateHeaders()}
                                <th>Sign1</th>
                                <th>Sign2</th>
                            </tr>
                            ${students.map(student => {
                                const examYear = student.years.find(y => y.year === year);
                                if (!examYear) return '';
                                const exam = examYear.exams.find(e => e.term === term && e.examType === examType);
                                if (!exam) return '';
                                return `<tr>${generateRows(student, exam)}</tr>`;
                            }).join('')}
                        </table>
                    </div>
                    <div class="footer">
                        <p>Correction Sheet for ${stream} produced by Matinyani Mixed Secondary School on ${new Date().toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
`;


        await page.setContent(content);
        const pdf = await page.pdf({ format: 'A4' });

        // Close page with a frame
        await page.setContent('</div></div></div></body></html>');

        await browser.close();

        res.contentType('application/pdf');
        res.send(pdf);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error generating correction sheet PDF');
    }
});

module.exports = router;
