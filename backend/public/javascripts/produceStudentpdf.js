const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const generateTranscriptPdf = async (student) => {
    const pdfDoc = await PDFDocument.create();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    let page = pdfDoc.addPage([600, 800]);

    const titleFontSize = 18;
    const textFontSize = 12;
    const margin = 50;
    let yOffset = page.getHeight() - margin;

    // Add title
    page.drawText('Matinyani Mixed Secondary School', {
        x: margin,
        y: yOffset,
        size: titleFontSize,
        font: helveticaFont,
        color: rgb(0, 0.53, 0.71),
    });

    yOffset -= titleFontSize + 10;

    page.drawText('Student Transcript', {
        x: margin,
        y: yOffset,
        size: titleFontSize,
        font: helveticaFont,
        color: rgb(0, 0.53, 0.71),
    });

    yOffset -= titleFontSize + 20;

    // Add student information
    const studentInfo = [
        `Name: ${student.studentName}`,
        `Admission: ${student.studentAdmission}`,
        `Gender: ${student.gender}`,
        `Stream: ${student.stream}`,
        `Rank: ${student.rank}`,
        `Total Points: ${student.totalPoints}`,
        `Total Grade: ${student.totalGrade}`
    ];

    studentInfo.forEach(info => {
        page.drawText(info, {
            x: margin,
            y: yOffset,
            size: textFontSize,
            font: helveticaFont,
        });
        yOffset -= textFontSize + 5;
    });

    yOffset -= 10;

    // Add table header for units
    const unitHeaders = ['Unit', 'Total Marks', 'Grade'];
    const colWidths = [200, 100, 100];
    let xOffset = margin;

    unitHeaders.forEach((header, i) => {
        page.drawText(header, {
            x: xOffset,
            y: yOffset,
            size: textFontSize,
            font: helveticaFont,
        });
        xOffset += colWidths[i];
    });

    yOffset -= textFontSize + 5;

    // Draw units information
    student.units.forEach(unit => {
        xOffset = margin;
        const unitData = [unit.name, unit.totalMarks, unit.grade];
        unitData.forEach((data, i) => {
            page.drawText(data.toString(), {
                x: xOffset,
                y: yOffset,
                size: textFontSize,
                font: helveticaFont,
            });
            xOffset += colWidths[i];
        });
        yOffset -= textFontSize + 5;
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
};

const saveTranscriptPdf = async (studentAdmission, pdfBytes) => {
    const newTranscript = new StudentTranscript({
        studentAdmission,
        pdf: pdfBytes
    });
    await newTranscript.save();
    console.log(`Transcript saved for student: ${studentAdmission}`);
};
