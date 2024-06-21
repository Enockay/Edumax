const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Student = require('../../public/models/admitStudentSchema'); // Adjust the path as necessary
const { launchPuppeteer } = require('../../puppeteerConfig');

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
        const browser = await launchPuppeteer();
        const page = await browser.newPage();

        // Construct HTML content to resemble the uploaded PDF structure
        const htmlContent = `
            <html>
            <head>
                <style>
                    /* Custom styles */
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: white;
                    }
                    .container {
                        width: 700px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 2px solid #333;
                        background-color: #fff;
                    }
                    .header, .footer {
                        text-align: center;
                        margin: 20px;
                    }
                    .header img {
                        max-width: 150px;
                    }
                    .header h1 {
                        font-size: 24px;
                        font-weight: bold;
                        margin: 10px 0;
                    }
                    .statement-info {
                        margin-bottom: 20px;
                    }
                    .statement-info p {
                        margin: 5px 0;
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
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="school-logo.png" alt="School Logo">
                        <h1>Fee Payment Records</h1>
                    </div>
                    <div class="statement-info">
                        <p><strong>Reg No.:</strong> ${admissionNumber}</p>
                        <p><strong>Name:</strong> ${feeRecords.fullName}</p>
                        <p><strong>Stream:</strong> ${stream}</p>
                        <p><strong>Year:</strong> ${year}</p>
                    </div>
                    <table class="table">
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Amount</th>
                        </tr>
                        ${feeRecords.feesRecord.map(term => term.payments.map(payment => `
                            <tr>
                                <td>${new Date(payment.date).toLocaleDateString()}</td>
                                <td>${payment.levi}</td>
                                <td>${payment.amount}</td>
                            </tr>
                        `).join('')).join('')}
                        <tr>
                            <td colspan="2" style="text-align: right;"><strong>Total Balance:</strong></td>
                            <td><strong>${feeRecords.feesRecord.reduce((total, term) => total + term.totalTuitionToBePaid + term.totalUniformFeesToBePaid + term.totalLunchFeesToBePaid - term.payments.reduce((total, payment) => total + payment.amount, 0), 0)}</strong></td>
                        </tr>
                    </table>
                    <div class="footer">
                        <p>Produced by Finance, Mantinyani Mixed Secondary</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Set HTML content and generate PDF
        await page.setContent(htmlContent);
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

        await browser.close();

        // Set PDF file name
        const pdfFileName = `${admissionNumber}_Report.pdf`;

        // Send PDF as response
        res.setHeader('Content-Disposition', `attachment; filename=${pdfFileName}`);
        res.contentType('application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Error generating PDF' });
    }
});

module.exports = router;
