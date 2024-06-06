const puppeteer = require('puppeteer');
const savePdf = require('./storePdf');
const fs = require("fs")
const path = require('path');

// Default unit headers
const defaultUnitHeaders = ['Eng', 'Kisw', 'Math', 'Chem', 'Bio', 'Phys', 'Geo', 'Hist', 'Agri', 'Busn', 'CRE', 'Comp'];
const logoPath = path.join(__dirname, '../../public/images/logo.png');
    const logoBase64 = fs.readFileSync(logoPath).toString('base64');
    const logoDataUrl = `data:image/png;base64,${logoBase64}`;

// Function to generate PDF
const generateClassRankingPdf = async (year, stream, term, teacher, gradedStudents, unitMeans, classMean, fileName) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Compute rankings
    gradedStudents.sort((a, b) => b.totalPoints - a.totalPoints); // Sort by totalPoints descending
    let rank = 1;
    for (let i = 0; i < gradedStudents.length; i++) {
        if (i > 0 && gradedStudents[i].totalPoints === gradedStudents[i - 1].totalPoints) {
            gradedStudents[i].rank = gradedStudents[i - 1].rank; // Same rank for same points
        } else {
            gradedStudents[i].rank = rank;
        }
        rank++;
    }

    const studentsData = gradedStudents.map(student => {
        // Find the relevant year data
        const yearData = student.years.find(y => y.year === year);
        if (!yearData) return null; // Skip if no data for the year

        // Find the relevant term data
        const termData = yearData.exams.find(exam => exam.term === term);
        if (!termData) return null; // Skip if no data for the term

        // Extract the unit data for the term
        const units = termData.units || [];
        return {
            rank: gradedStudents.rank || '--',
            admission: student.studentAdmission || '--',
            name: student.studentName || '--',
            gender: student.gender || '--',
            stream: student.stream || '--',
            units: defaultUnitHeaders.map(unit => {
                const unitData = units.find(u => u.subject === unit) || {};
                const totalMarks = unitData.totalMarks !== undefined ? unitData.totalMarks : '--';
                const grade = unitData.grade !== undefined ? unitData.grade : '--';
                return { totalMarks, grade };
            }),
            totalPoints: termData.totalPoints || '--',
            totalGrade: termData.totalGrade || '--',
        };
    }).filter(student => student !== null); 


    // Inline HTML template
    const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Class Ranking</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    margin: 0;
                }
                .outer-frame {
                    border: 3px solid lightblue;
                    padding: 25px;
                }
                .inner-frame {
                    border: 2px solid #000;
                    padding: 0;
                }
                 .footer {
                    text-align: center;
                    margin: 10px 0;
                }
                .header {
                    position: relative;
                    border-bottom : 1px solid #000;
                    height : fit-content;
                    padding : 0.8rem;
                }
                .header img {
                    position: absolute;
                    left: 20px;
                    top: 10px;
                    width: 100px;
                    height: 100px;
                }
                .header{
                    text-align:center;
                }
                .header h1, .header h2 {
                    margin: 0;
                }
                p{
                    margin : 0;
                }
                .table-container {
                    margin: 20px auto;
                    width: 100%;
                    overflow: auto;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    table-layout: fixed;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 4px;
                    text-align: center;
                    
                }
                td{
                    font-size: 0.7rem;
                }
                th {
                    background-color: #f2f2f2;
                    font-size: 0.75rem;
                }
                th.name-header {
                    width: 130px; /* Extend the width for name column */
                }
                td.name-cell {
                    text-align: left; /* Align text to the left for better readability */
                    padding-left: 10px; /* Add padding for the name column */
                }
                .summary-section {
                    page-break-before: always; /* Start a new page for the summary */
                }
                .AGP{
                    background-color: #f2f2f2;
                }
                .summary-table {
                    margin: 20px auto;
                    width: 50%;
                    border-collapse: collapse;
                }
                .summary-table th, .summary-table td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: center;
                    font-size: 12px;
                }
                .footer {
                    margin-top:0;
                    font-size: 12px;
                    text-align: center;
                }
                .page-break {
                    page-break-after: always;
                }
                h3,h2{margin : 0;
                    font-size:1rem;
                }
            </style>
        </head>
        <body>
            <div class="outer-frame">
                <div class="inner-frame">
                    <div class="header">
                        <img src=${logoDataUrl} alt="School Logo">
                        <h2>MATINYANI MIXED SECONDARY SCHOOL</h2>
                        <h3>BROADSHEET RESULTS FORM</h3>
                        <h3>EXAM :${term} MidTerm EXAM</h3>
                        <h3>ClASS: FORM${stream}<h3>
                        <h3>Release Date: ${new Date().toLocaleDateString()}</h3>
                    </div>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Adm</th>
                                    <th class="name-header">Name</th>
                                    <th>Gender</th>
                                    <th>Stream</th>
                                    ${defaultUnitHeaders.map(unit => `<th>${unit}</th>`).join('')}
                                    <th>AGP</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${studentsData.map(student => `
                                    <tr>
                                        <td>${student.rank}</td>
                                        <td>${student.admission}</td>
                                        <td class="name-cell">${student.name}</td>
                                        <td>${student.gender}</td>
                                        <td>${student.stream}</td>
                                        ${student.units.map(unit => `<td>${unit.totalMarks} ${unit.grade}</td>`).join('')}
                                        <td class="AGP">${student.totalPoints}${student.totalGrade}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="footer">
                <p>Results generated by Matinyani Mixed Secondary School</p>
            </div>
            </div>
            <div class="page-break"></div>
            <div class="outer-frame">
                <div class="inner-frame">
                    <div class="summary-section">
                        <h3>Class Mean</h3>
                        <table class="summary-table">
                            <tr>
                                <th>Class Mean</th>
                                <td>${classMean.toFixed(2)}</td>
                            </tr>
                        </table>
                        <h3>Unit Means</h3>
                        <table class="summary-table">
                            <thead>
                                <tr>
                                    <th>Unit</th>
                                    <th>Mean</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${Object.entries(unitMeans).map(([unit, mean]) => `
                                    <tr>
                                        <td>${unit}</td>
                                        <td>${mean.toFixed(2)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                </div>
                <div class="footer">
                        <p>Results generated by Matinyani Mixed Secondary School</p>
                    </div>
            </div>      
        </body>
        </html>
    `;

    // Set the content of the page
    await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });

    // Generate PDF in landscape mode
    const pdfBytes = await page.pdf({
        format: 'A4',
        landscape: true,
        printBackground: true,
        margin: {
            top: '20mm',
            bottom: '20mm',
            left: '10mm',
            right: '10mm'
        }
    });

    await browser.close();

    // Save the PDF to MongoDB or any storage
    await savePdf(year, term, stream, fileName, pdfBytes);
};

module.exports = generateClassRankingPdf;
