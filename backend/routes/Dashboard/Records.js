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

        // Construct HTML content
        const htmlContent = `
            <html>
            <head>
                <style>
                    /* Custom styles */
                    body {
                        font-family: Arial, sans-serif;
                        margin: 15px;
                        padding: 0;
                        display:flex;
                        flex-direction :column;
                        justify-content:center;
                        align-items:center;
                        background-color: white;
                    }
                    .container {
                        width: 700px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 2px solid #333;
                        background-color: #fff;
                    }
                    .header {
                        margin-bottom: 20px;
                        border: 1px solid #ccc;
                        padding: 10px;
                        margin: 20px;
                    }
                    .heading {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }
                    .school-logo {
                        max-width: 150px;
                    }
                    .title {
                        font-size: 24px;
                        font-weight: bold;
                        margin: 0;
                        text-align: center;
                        flex-grow: 1;
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
                        margin-top: 0;
                        font-size: 14px;
                    }
                    .border-frame {
                        border: 1px solid #000;
                        padding: 10px;
                        margin: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    
                    <div class="border-frame">
                        <div class="statement-info">
                        <div class="header">
                        <div class="heading">
                        <img src="school-logo.png" alt="School Logo" class="school-logo">
                        <h1 class="title">Fee Payment Records</h1>
                        </div>
                        <p><strong>Student Name:</strong> ${feeRecords.fullName}</p>
                        <p><strong>Stream:</strong> ${stream}</p>
                        <p><strong>Year:</strong> ${year}</p>
                         </div>
                            
                        </div>
                        <table class="table">
                            <tr>
                                <th>Date</th>
                                <th>Term</th>
                                <th>Levy</th>
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
                                <td colspan="4" style="text-align: right;"><strong>Total Balance:</strong></td>
                                <td><strong>${feeRecords.feesRecord.reduce((total, term) => total + term.totalTuitionToBePaid + term.totalUniformFeesToBePaid + term.totalLunchFeesToBePaid - term.payments.reduce((total, payment) => total + payment.amount, 0), 0)}</strong></td>
                            </tr>
                        </table>
                    </div>
                    <p class="footer">Fees Statement for Admission ${admissionNumber} generated by Matinyani Mixed Finance Office</p>
                </div>
                <p class="footer">Produced by Finance, Mantinyani Mixed Secondary</p>
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
