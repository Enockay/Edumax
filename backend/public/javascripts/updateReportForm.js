const mongoose = require('mongoose');
const { StudentMarks } = require('../models/feedStudentMarks'); // Adjust the path to your file

async function updateStudentPdf(studentAdmission, year, term, examType, pdfBuffer) {
  try {
    // Normalize year to string
    const normalizedYear = String(year);

    console.log(`Attempting to update PDF for student ${studentAdmission}, year ${normalizedYear}, term ${term}, examType ${examType}`);

    // Attempt to find the specific student and exam
    const updateResult = await StudentMarks.updateOne(
      {
        studentAdmission,
        'years.year': normalizedYear,
        'years.exams.term': term,
        'years.exams.examType': examType
      },
      {
        $set: {
          'years.$[yearElem].exams.$[examElem].pdf': pdfBuffer
        }
      },
      {
        arrayFilters: [
          { 'yearElem.year': normalizedYear },
          { 'examElem.term': term, 'examElem.examType': examType }
        ]
      }
    );

    console.log('Update result:', updateResult);

    if (updateResult.matchedCount > 0) {
      if (updateResult.modifiedCount > 0) {
       // console.log('PDF updated successfully');
      } else {
        console.log('PDF update failed: Document found, but no changes made');
      }
    } else {
      console.log('PDF update failed: No matching record found');
    }
  
  } catch (error) {
    console.error('Error updating PDF:', error);
  }
  
}
async function fetchUpdatedDocument(studentAdmission, year, term, examType) {
    try {
      const student = await StudentMarks.findOne({
        studentAdmission,
        'years.year': String(year),
        'years.exams.term': term,
        'years.exams.examType': examType
      });
  
      if (!student) {
        console.log('Document not found');
        return;
      }
  
      // Navigate to the specific exam record
      const yearRecord = student.years.find(y => y.year === String(year));
      const examRecord = yearRecord.exams.find(e => e.term === term && e.examType === examType);
  
      console.log('Found document:', examRecord);
      console.log('PDF buffer length:', examRecord.pdf ? examRecord.pdf.length : 'No PDF found');
    } catch (error) {
      console.error('Error fetching document:', error);
    }
  }

module.exports = updateStudentPdf;
