const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Student = require('../../public/models/admitStudentSchema'); // Adjust the path as necessary
const puppeteer = require('puppeteer');

router.get('/fetchFeesRecords', async (req, res) => {
    const { year, stream, admissionNumber } = req.query;
    
    const Studentstream = await Student(stream);

    try {
        const student = await Studentstream.findOne({
            admissionNumber,
            stream,
            'fees.year.year': year
        }, 'fullName admissionNumber fees');

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const feesRecord = student.fees.year.find(y => y.year === year);
        if (!feesRecord) {
            return res.status(404).json({ message: 'Fees record not found for the given year' });
        }

        res.status(200).json({
            fullName: student.fullName,
            admissionNumber: student.admissionNumber,
            feesRecord: feesRecord.termfees
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
});


router.post('/generatePDF', async (req, res) => {
    const { year, stream, admissionNumber, feeRecords } = req.body;

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Construct HTML content
        const htmlContent = `
            <html>
            <head>
                <style>
                    /* Add your custom styles here */
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f5f5f5;
                    }
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 2px solid #333;
                        background-color: #fff;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .school-logo {
                        max-width: 150px;
                        margin-bottom: 10px;
                    }
                    .title {
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 10px;
                        text-align: center;
                    }
                    .statement-info {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    .table th, .table td {
                        border: 1px solid #ccc;
                        padding: 8px;
                        text-align: left;
                    }
                    .table th {
                        background-color: #f2f2f2;
                        font-weight: bold;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 50px;
                        font-size: 14px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="school-logo.png" alt="School Logo" class="school-logo">
                        <h1 class="title">Fee Payment Records</h1>
                    </div>
                    <div class="statement-info">
                        <p><strong>Student Name:</strong> ${feeRecords.fullName}</p>
                        <p><strong>Stream:</strong> ${stream}</p>
                        <p><strong>Term:</strong> ${year}</p>
                    </div>
                    <table class="table">
                        <tr>
                            <th>Date</th>
                            <th>Term</th>
                            <th>levi</th>
                            <th>Mode</th>
                            <th>Amount</th>
                        </tr>
                        ${feeRecords.feesRecord.map(term => term.payments.map(payment => `
                            <tr>
                                <td>${new Date(payment.date).toLocaleDateString()}</td>
                                <td>${term.term}</td>
                                <td>${payment.levi}</td>
                                <td>${payment.mode}</td>
                                <td>${payment.amount}</td>
                            </tr>
                        `).join('')).join('')}
                        <tr>
                            <td></td>
                            <td><strong>Total Balance:</strong></td>
                            <td><strong>${feeRecords.feesRecord.reduce((total, term) => total + term.totalTuitionToBePaid + term.totalUniformFeesToBePaid + term.totalLunchFeesToBePaid - term.payments.reduce((total, payment) => total + payment.amount, 0), 0)}</strong></td>
                        </tr>
                    </table>
                    <p class="footer">Produced by Finance, Mantinyani Mixed Secondary</p>
                    <p class="footer">Approved by Principal, Martin Kitome Kimongo</p>
                    <p class="footer">School Stamp</p>
                </div>
            </body>
            </html>
        `;

        // Set HTML content and generate PDF
        await page.setContent(htmlContent);
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

        await browser.close();

        // Send PDF as response
        res.contentType('application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Error generating PDF' });
    }
});

module.exports = router;

