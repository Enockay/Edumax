const { launchPuppeteer } = require('../../puppeteerConfig');
const fs = require('fs');
const path = require('path');
const { ProducedResults } = require("../models/feedStudentMarks");
const updateStudentPdf = require('./updateReportForm');

const generateReportform = async (year, stream, term, examType) => {
  try {
    const students = await ProducedResults.find({ stream });

    if (!students || students.length === 0) {
      console.log('No students found');
      return;
    }

    const reportsDir = './reports';
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }

    const subjectMapping = {
      Eng: 'English',
      Kisw: 'Kiswahili',
      Math: 'Mathematics',
      Bio: 'Biology',
      Phys: 'Physics',
      Chem: 'Chemistry',
      Hist: 'History',
      Geo: 'Geography',
      CRE: 'CRE',
      Comp: 'Computer',
      Agri: 'Agriculture',
      Busn: 'Business Studies'
    };

    const gradeRemarks = (grade) => {
      if (grade.startsWith('A')) return 'Excellence';
      if (grade.startsWith('B')) return 'Good';
      if (grade.startsWith('C')) return 'Fair';
      if (grade.startsWith('D')) return 'Can do better';
      if (grade.startsWith('E')) return 'Poor';
      return '--';
    };

    const logoPath = path.join(__dirname, '../../public/images/logo.png');
    const logoBase64 = fs.readFileSync(logoPath).toString('base64');
    const logoDataUrl = `data:image/png;base64,${logoBase64}`;
    
    const browser = await launchPuppeteer();
    const page = await browser.newPage();

    for (const student of students) {
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: auto; font-size: 0.9rem; padding: 0; box-sizing: border-box; }
              .report-card { padding: 1rem; width: calc(100% - 40px); margin: 0 auto; border: 1px solid #000; padding-bottom:3rem; }
              .header { display: flex; align-items: center; margin-bottom: 0; }
               img{ width: 80px; height: 80px; background: url() no-repeat center center; background-size: contain; margin:0.5rem;}
              .school-details { text-align: center; flex-grow: 1; }
              .student-details, .subject-table, .summary-table, .details-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
              .student-details th, .student-details td, .subject-table th, .subject-table td, .summary-table th, .summary-table td, .details-table th, .details-table td { border: 1px solid #000; padding: 8px; }
              .footer { margin-top: 10px; font-size: 12px; }
              .remarks, .signature, .important-dates { margin-top: 10px; }
               h4 { margin: 5px 0; }
               h2{margin :0;}
              .summary-table { width: 50%; margin: 0 auto; }
              .principal {display:flex; gap:5%;}
              .principal div {margin-bottom:0.5rem;}
              .outer-frame { padding: 0; border: 1px solid #000;  }
              th { font-size: 0.7rem; }
              td { font-size: 0.7rem; }
              li{margin-bottom:0.5rem;}
              hr {border:0.1px solid black}
            </style>
          </head>
          <body>
            <div class="report-card">
              <div class="outer-frame">
                <div class="header">
                  <div class="logo">
                   <img src='${logoDataUrl}' alt="logo">
                   </div>
                  <div class="school-details">
                    <h2>MATINYANI MIXED SECONDARY SCHOOL</h2>
                    <div>P.O. BOX 1423 - 90200, KITUI</div>
                    <div>Tel: +254721687404</div>
                   <center><h4>REPORT FORM</h4></center>
                  </div>
                </div>
                <div class="student-details">
                  <table class="details-table">
                    <tr>
                      <th>ADM NO.</th>
                      <td>${student.studentAdmission}</td>
                      <th>TERM</th>
                      <td>${term}</td>
                      <th>YEAR</th>
                      <td>${year}</td>
                    </tr>
                    <tr>
                      <th>FULL NAME</th>
                      <td colspan="3">${student.studentName}</td>
                      <th>GENDER</th>
                      <td>${student.gender}</td>
                    </tr>
                    <tr>
                      <th>CLASS</th>
                      <td colspan="3">${student.stream}</td>
                      <th>KCPE MARKS</th>
                      <td>${student.kcpe || ''}</td>
                    </tr>
                    <tr>
                      <th>CLASS RANK</th>
                      <td>${student.years[0].exams[0].classRank||''}</td>
                      <th>OVERALL RANK</th>
                      <td>${student.years[0].exams[0].classRank||''}</td>
                      <th></th>
                      <td></td>
                    </tr>
                  </table>
                </div>
                <div class="content">
                  <table class="subject-table">
                    <thead>
                      <tr>
                        <th>SUBJECT</th>
                        <th>${term} ${year} ${examType} EXAM</th>
                        <th>TOTAL (100)</th>
                        <th>GRADE</th>
                        <th>POINTS</th>
                        <th>REMARKS</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${Object.keys(subjectMapping).map(subjectCode => {
                        const unit = student.years[0]?.exams[0]?.units.find(u => u.subject === subjectCode) || { totalMarks: '--', grade: '--', points: '--', remarks: '--' };
                        return `
                          <tr>
                            <td>${subjectMapping[subjectCode]}</td>
                            <td>${unit.totalMarks}</td>
                            <td>${unit.totalMarks}</td>
                            <td>${unit.grade}</td>
                            <td>${unit.points}</td>
                            <td>${gradeRemarks(unit.grade)}</td>
                          </tr>
                        `;
                      }).join('')}
                      <tr>
                        <th colspan="1">Total Marks</th>
                        <td colspan="1">${student.years[0]?.exams[0]?.totalMarks || '--'} out of 700</td>
                        <th colspan="1">Total Points</th>
                        <td colspan="1">${student.years[0]?.exams[0]?.totalPoints || '--'} out of 84</td>
                        <th colspan="1">Total Grade</th>
                        <td colspan="1">${student.years[0]?.exams[0]?.totalGrade || '--'}</td>
                      </tr>
                    </tbody>
                  </table>
                 <center><h4>Progressive Summary</h4><center> 
                  <table class="summary-table">
                    <thead>
                      <tr>
                        <th>FORM</th>
                        <th>TERM 1</th>
                        <th>TERM 2</th>
                        <th>TERM 3</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>${student.years[0]?.exams[0].examType?.examType || '--'}</td>
                        <td>${student.years[0]?.progressiveSummary?.term2 || '--'}</td>
                        <td>${student.years[0]?.progressiveSummary?.term3 || '--'}</td>
                      </tr>
                    </tbody>
                  </table>
                  <hr>
                  <div class="footer">
                    <div class="remarks">
                      <strong>Overall Performance Remarks:</strong> ${gradeRemarks(student.years[0]?.exams[0]?.totalGrade) || 'There is still room for improvement.'}
                    </div>
                    <hr>
                    <div class="principal"><strong>Class Teacher:</strong> _________________________
                    <div><strong>Class Teacher Remarks:</strong> _________________________</div>
                    </div>
                    <div class="principal">
                       <strong>Principal:</strong> MATIN KITHOME KIMONGO
                       <div><strong>SIGNATURE:</strong> _________________________</div>
                       <div><strong>STAMP:</strong> _________________________</div>
                    </div>
                    <div><strong>Principal Remarks:</strong> _________________________</div>
                  </div>
                  <hr>
                  <div class="important-dates">
                    <h4>Important Dates:</h4>
                    <ul>
                      <li>Closing Date: _________________________</li>
                      <li>Opening Date: _________________________</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;

      await page.setContent(htmlContent);
      const pdfBuffer = await page.pdf({ format: 'A4' });

      const filePath = path.join(reportsDir, `${student.studentName}_report.pdf`);
      fs.writeFileSync(filePath, pdfBuffer);

      // Save the PDF to MongoDB
      await updateStudentPdf(student.studentAdmission, year, term, examType, pdfBuffer)

      //console.log(`Report for ${student.studentName} saved at ${filePath}`);
    }

    await browser.close();
  } catch (error) {
    console.error('Error generating report forms:', error);
  }
};

module.exports = generateReportform;
