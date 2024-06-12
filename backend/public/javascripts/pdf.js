const { launchPuppeteer } = require('../../puppeteerConfig');
const savePdf = require('./storePdf');
const fs = require("fs");
const path = require('path');

// Default unit headers
const defaultUnitHeaders = ['Eng', 'Kisw', 'Math', 'Chem', 'Bio', 'Phys', 'Geo', 'Hist', 'Agri', 'Busn', 'CRE', 'Comp'];
const logoPath = path.join(__dirname, '../../public/images/logo.png');
const logoBase64 = fs.readFileSync(logoPath).toString('base64');
const logoDataUrl = `data:image/png;base64,${logoBase64}`;

// Function to generate PDF
const generateClassRankingPdf = async (year,stream,term,Teacher,gradedStudents, unitMeans, Mean, fileName,exams) => {
    console.log(fileName)
    const browser = await launchPuppeteer();
    const page = await browser.newPage();

    // Compute rankings
    gradedStudents.sort((a, b) => b.years[0].exams[0].totalPoints - a.years[0].exams[0].totalPoints);
    let rank = 1;
    for (let i = 0; i < gradedStudents.length; i++) {
        if (i > 0 && gradedStudents[i].years[0].exams[0].totalPoints === gradedStudents[i - 1].years[0].exams[0].totalPoints) {
            gradedStudents[i].rank = gradedStudents[i - 1].rank;
        } else {
            gradedStudents[i].rank = rank;
        }
        rank++;
    }

    // Group by stream for stream ranking
    const studentsByStream = gradedStudents.reduce((acc, student) => {
        if (!acc[student.stream]) {
            acc[student.stream] = [];
        }
        acc[student.stream].push(student);
        return acc;
    }, {});

    Object.keys(studentsByStream).forEach(stream => {
        const streamStudents = studentsByStream[stream];
        streamStudents.sort((a, b) => b.years[0].exams[0].totalPoints - a.years[0].exams[0].totalPoints);
        let streamRank = 1;
        for (let i = 0; i < streamStudents.length; i++) {
            if (i > 0 && streamStudents[i].years[0].exams[0].totalPoints === streamStudents[i - 1].years[0].exams[0].totalPoints) {
                streamStudents[i].streamRank = streamStudents[i - 1].streamRank;
            } else {
                streamStudents[i].streamRank = streamRank;
            }
            streamRank++;
        }
    });

    const studentsData = gradedStudents.map(student => {
        const yearData = student.years.find(y => y.year === year);
        if (!yearData) return null;
        const termData = yearData.exams.find(exam => exam.term === term);
        if (!termData) return null;
        const units = termData.units || [];
        return {
            rank: student.rank || '--',
            admission: student.studentAdmission || '--',
            name: student.studentName || '--',
            gender: student.gender || '--',
            stream: student.stream || '--',
            streamRank: student.streamRank || '--',
            totalMarks: termData.totalMarks || '--',
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

    // Grade distribution analysis
    const gradeDistribution = {};
    gradedStudents.forEach(student => {
        const grade = student.years[0].exams[0].totalGrade;
        if (!gradeDistribution[grade]) {
            gradeDistribution[grade] = { total: 0, streams: {} };
        }
        gradeDistribution[grade].total++;
        if (!gradeDistribution[grade].streams[student.stream]) {
            gradeDistribution[grade].streams[student.stream] = 0;
        }
        gradeDistribution[grade].streams[student.stream]++;
    });

    // Class mean calculation
    const totalPoints = gradedStudents.reduce((acc, student) => acc + student.years[0].exams[0].totalPoints, 0);
    const classMeanRaw = totalPoints / gradedStudents.length;
    
    // Mapping the class mean to a scale of 1-12
    const classMean = Math.round((classMeanRaw / 12) * 12);

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
                    border-bottom: 1px solid #000;
                    height: fit-content;
                    padding: 0.8rem;
                }
                .header img {
                    position: absolute;
                    left: 20px;
                    top: 10px;
                    width: 100px;
                    height: 100px;
                }
                .header {
                    text-align: center;
                }
                .header h1, .header h2 {
                    margin: 0;
                }
                p {
                    margin: 0;
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
                td {
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
                .AGP {
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
                    margin-top: 0;
                    font-size: 12px;
                    text-align: center;
                }
                .page-break {
                    page-break-after: always;
                }
                h3, h2 {
                    margin: 0;
                    font-size: 1rem;
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
                        <h3>EXAM: ${term} ${exams} EXAM</h3>
                        <h3>CLASS: FORM ${stream}</h3>
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
                                    <th>Total Marks</th>
                                    <th>Stream Rank</th>
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
                                        <td>${student.totalMarks}</td>
                                        <td>${student.streamRank}</td>
                                        <td class="AGP">${student.totalPoints} ${student.totalGrade}</td>
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
                       <center> <h3>Class Mean</h3></center>
                        <table class="summary-table">
                            <tr>
                                <th>Class Mean</th>
                                <td>${classMean}</td>
                            </tr>
                        </table>
                        <center><h3>Unit Means</h3></center>
                        <table class="summary-table">
                             ${Object.entries(unitMeans).map(([unit, mean]) => 
                                ` <thead>
                                    <tr>
                                        <th>${unit}</th>
                                        <th>${mean.toFixed(2)}</th>
                                    </tr>
                                `).join('')}
                                
                            </thead>
                            <tbody>
                               <tr>
                                    <td>Unit</td>
                                    <td>Mean</td>
                                </tr>
                            </tbody>
                        </table>
                       <center> <h4>Grade Distribution</h4></center>
                        <table class="summary-table">
                            <thead>
                                <tr>
                                    <th>Grade</th>
                                    <th>Total</th>
                                    ${Object.keys(studentsByStream).map(stream => `<th>${stream}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${Object.entries(gradeDistribution).map(([grade, data]) => `
                                    <tr>
                                        <td>${grade}</td>
                                        <td>${data.total}</td>
                                        ${Object.keys(studentsByStream).map(stream => `<td>${data.streams[stream] || 0}</td>`).join('')}
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
    try {
        await savePdf(year, term, stream, exams, fileName, pdfBytes);
        return `Form ${stream} ${term} Results are Now Available For Printing`;
    } catch (err) {
        return `Error occurred while producing results PDF`;
    }
};

module.exports = generateClassRankingPdf;
