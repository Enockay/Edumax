const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const {  ProducedResults } = require('../models/feedStudentMarks');
const savePdf = require('./storePdf');

const saveGradedStudents = async (gradedStudents) => {
    //console.log("Graded students:", JSON.stringify(gradedStudents, null, 2));
    try {
        const bulkOps = gradedStudents.map(student => {
            //console.log("Processing student:", student.studentAdmission);

            // Ensure student.years is defined and is an array
            if (!Array.isArray(student.years)) {
              //  console.error('Error: Student years data is invalid:', student);
                return null;
            }

            const yearEntries = student.years.map(year => {
               // console.log("Processing year:", year.year);

                // Ensure year.exams is defined and is an array
                if (!Array.isArray(year.exams)) {
                    console.error('Error: Year exams data is invalid:', year);
                    return null;
                }

                return {
                    year: year.year,
                    exams: year.exams.map(exam => {
                       // console.log("Processing exam:", exam.examType, exam.term);

                        // Ensure exam.units is defined and is an array
                        if (!Array.isArray(exam.units)) {
                            console.error('Error: Exam units data is invalid:', exam);
                            return null;
                        }

                        const units = exam.units.map(unit => {
                           // console.log("Processing unit:", JSON.stringify(unit, null, 2));

                            if (!unit.totalMarks || !unit.points || !unit.grade) {
                                console.error('Error: Unit data is incomplete:', unit);
                            }

                            return {
                                subject: unit.subject,
                                P1: unit.P1,
                                P2: unit.P2,
                                P3: unit.P3,
                                totalMarks: unit.totalMarks,
                                points: unit.points,
                                grade: unit.grade
                            };
                        });

                        return {
                            examType: exam.examType,
                            term: exam.term,
                            units: units,
                            totalPoints: exam.totalPoints,
                            totalGrade: exam.totalGrade
                        };
                    }).filter(Boolean) // Filter out null entries
                };
            }).filter(Boolean); // Filter out null entries

            const bulkOp = {
                updateOne: {
                    filter: { studentAdmission: student.studentAdmission },
                    update: {
                        $set: {
                            studentName: student.studentName,
                            gender: student.gender,
                            stream: student.stream,
                            years: yearEntries
                        }
                    },
                    upsert: true
                }
            };

          //  console.log("Bulk operation for student:", JSON.stringify(bulkOp, null, 2));
            return bulkOp;
        }).filter(Boolean); // Filter out null entries

        //console.log("Bulk operations to be executed:", JSON.stringify(bulkOps, null, 2));
        await ProducedResults.bulkWrite(bulkOps);
       // console.log('Graded students saved to database successfully');
    } catch (error) {
        console.error('Error saving graded students:', error);
    }
};


// Helper function to calculate centered position
const getCenteredPosition = (text, fontSize, pageWidth, font) => {
    return (pageWidth - font.widthOfTextAtSize(text, fontSize)) / 2;
};

const generateClassListForm = async (year,stream, term, teacher, gradedStudents, unitMeans, classMean, fileName) => {
    const formatStream = (stream) => {
        const currentYear = new Date().getFullYear();
        return !isNaN(stream) ? `Form ${stream} ${currentYear}` : stream;
    };
    const Stream = formatStream(stream);
    try{
    const pdfDoc = await PDFDocument.create();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    let page = pdfDoc.addPage([1000, 800]);  // Landscape orientation

    const titleFontSize = 15;
    const subtitleFontSize = 14;
    const textFontSize = 12;
    const tableFontSize = 12;
    const margin = 40;
    let yOffset = page.getHeight() - margin;

    // Draw Header Frame
    const framePadding = 15;
    const frameWidth = page.getWidth() - 2 * margin;
    const frameHeight = 140; // Adjusted to fit all header content
    const frameX = margin;
    const frameY = yOffset - frameHeight;

    page.drawRectangle({
        x: frameX,
        y: frameY,
        width: frameWidth,
        height: frameHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
    });

    yOffset = frameY + frameHeight - framePadding;

    // Add Header
    const headerText = 'Matinyani Mixed Secondary School';
    page.drawText(headerText, {
        x: getCenteredPosition(headerText, titleFontSize, page.getWidth(), helveticaFont),
        y: yOffset,
        size: titleFontSize,
        font: helveticaFont,
        color: rgb(0, 0.53, 0.71),
    });

    yOffset -= titleFontSize + 10;

    const subHeaderText = `Transcript Result Form`;
    page.drawText(subHeaderText, {
        x: getCenteredPosition(subHeaderText, subtitleFontSize, page.getWidth(), helveticaFont),
        y: yOffset,
        size: subtitleFontSize,
        font: helveticaFont,
        color: rgb(0, 0.53, 0.71),
    });

    yOffset -= subtitleFontSize + 10;

    const classText = `Class: ${Stream}`;
    page.drawText(classText, {
        x: getCenteredPosition(classText, textFontSize, page.getWidth(), helveticaFont),
        y: yOffset,
        size: textFontSize,
        font: helveticaFont,
    });

    yOffset -= textFontSize + 5;

    const termText = `Term: ${term}`;
    page.drawText(termText, {
        x: getCenteredPosition(termText, textFontSize, page.getWidth(), helveticaFont),
        y: yOffset,
        size: textFontSize,
        font: helveticaFont,
    });

    yOffset -= textFontSize + 5;

    const dateText = `Date: ${new Date().toLocaleDateString()}`;
    page.drawText(dateText, {
        x: getCenteredPosition(dateText, textFontSize, page.getWidth(), helveticaFont),
        y: yOffset,
        size: textFontSize,
        font: helveticaFont,
    });

    yOffset -= textFontSize + 5;

    // Adding Teacher's Name
    const teacherName = `Class Teacher: ${teacher}`;  // Replace with actual teacher's name if available
    page.drawText(teacherName, {
        x: getCenteredPosition(teacherName, textFontSize, page.getWidth(), helveticaFont),
        y: yOffset,
        size: textFontSize,
        font: helveticaFont,
    });

    yOffset -= textFontSize + framePadding + 15;

    // Table Header
    const headers = ['Rank', 'Admission', 'Name', 'Gender', 'Stream'].concat(Object.keys(unitMeans)).concat(['AGP']);
    const colWidths = [30, 60, 125, 50, 50].concat(new Array(Object.keys(unitMeans).length).fill(50)).concat([50]);
    let xOffset = margin;

    headers.forEach((header, i) => {
        page.drawText(header, {
            x: xOffset,
            y: yOffset,
            size: tableFontSize,
            font: helveticaFont,
        });
        xOffset += colWidths[i];
    });

    // Draw header lines
    yOffset -= tableFontSize + 5;

    // Draw horizontal line under the header
    page.drawLine({
        start: { x: margin, y: yOffset },
        end: { x: margin + colWidths.reduce((a, b) => a + b, 0), y: yOffset },
        thickness: 2,
        color: rgb(0, 0, 0),
    });

    yOffset -= 5;

    // Draw vertical lines for the header
    xOffset = margin;
    colWidths.forEach((width) => {
        page.drawLine({
            start: { x: xOffset, y: yOffset + tableFontSize + 15 },
            end: { x: xOffset, y: yOffset },
            thickness: 2,
            color: rgb(0, 0, 0),
        });
        xOffset += width;
    });

    // Draw final vertical line for the header
    page.drawLine({
        start: { x: margin + colWidths.reduce((a, b) => a + b, 0), y: yOffset + tableFontSize + 15 },
        end: { x: margin + colWidths.reduce((a, b) => a + b, 0), y: yOffset },
        thickness: 1,
        color: rgb(0, 0, 0),
    });

    // Students Information
    yOffset -= tableFontSize + 10;

    gradedStudents.forEach(student => {
        if (student.gender === "Male") {
            student.gender = "M"
        } else if (student.gender === "Female") {
            student.gender = "F"
        }
        xOffset = margin;
        const values = [
            student.rank,
            student.studentAdmission,
            student.studentName,
            student.gender ,
            student.stream
        ].concat(
            Object.keys(unitMeans).map(unit => {
                const unitData = student.years[0].exams[0].units.find(u => u.subject === unit) || {};
                const totalMarks = unitData.totalMarks !== undefined ? unitData.totalMarks : '--';
                const grade = unitData.grade !== undefined ? unitData.grade : '--';
                return `${totalMarks} ${grade}`;
            })
        ).concat(`${student.years[0].exams[0].totalPoints !== undefined ? student.years[0].exams[0].totalPoints : '--'} ${student.years[0].exams[0].totalGrade}`);

        values.forEach((value, i) => {
            page.drawText(value.toString(), {
                x: xOffset,
                y: yOffset,
                size: tableFontSize,
                font: helveticaFont,
            });
            xOffset += colWidths[i];
        });

        // Draw horizontal line for the student
        page.drawLine({
            start: { x: margin, y: yOffset - 2 },
            end: { x: margin + colWidths.reduce((a, b) => a + b, 0), y: yOffset - 2 },
            thickness: 0.5,
            color: rgb(0.5, 0.5, 0.5),
        });

        // Draw vertical lines for the student
        xOffset = margin;
        colWidths.forEach((width) => {
            page.drawLine({
                start: { x: xOffset, y: yOffset + tableFontSize + 3 },
                end: { x: xOffset, y: yOffset - 2 },
                thickness: 2,
                color: rgb(0.5, 0.5, 0.5),
            });
            xOffset += width;
        });

        yOffset -= tableFontSize + 10;

        // Check if page overflow
        if (yOffset < margin) {
            addFooter(page, helveticaFont, textFontSize, margin);
            page = pdfDoc.addPage([1000, 800]);  // New page in landscape orientation
            yOffset = page.getHeight() - margin;
        }
    });

    // Draw closing vertical line for the last column
    page.drawLine({
        start: { x: margin + colWidths.reduce((a, b) => a + b, 0), y: yOffset + tableFontSize + 5 },
        end: { x: margin + colWidths.reduce((a, b) => a + b, 0), y: margin },
        thickness: 0.5,
        color: rgb(0.5, 0.5, 0.5),
    });

    addFooter(page, helveticaFont, textFontSize, margin);

    // New Page for Unit Means and Class Mean
    const summaryPage = pdfDoc.addPage([1000, 800]);
    yOffset = summaryPage.getHeight() - margin;

    summaryPage.drawText('Unit Means', {
        x: getCenteredPosition('Unit Means', subtitleFontSize, summaryPage.getWidth(), helveticaFont),
        y: yOffset,
        size: subtitleFontSize,
        font: helveticaFont,
        color: rgb(0, 0.53, 0.71),
    });
    yOffset -= subtitleFontSize + 10;

    Object.entries(unitMeans).forEach(([unit, mean]) => {
        summaryPage.drawText(`${unit}: ${mean.toFixed(2)}`, {
            x: margin,
            y: yOffset,
            size: textFontSize,
            font: helveticaFont,
        });
        yOffset -= textFontSize + 5;
    });

    yOffset -= textFontSize + 10;
    summaryPage.drawText(`Class Mean: ${classMean.toFixed(2)}`, {
        x: margin,
        y: yOffset,
        size: textFontSize,
        font: helveticaFont,
        color: rgb(0, 0.53, 0.71),
    });

    addFooter(summaryPage, helveticaFont, textFontSize, margin);

    // Add Class Performance Graph
    const chartBuffer = await generateClassPerformanceChart(gradedStudents);
    const chartImage = await pdfDoc.embedPng(chartBuffer);
    const chartPage = pdfDoc.addPage([1000, 800]);
    chartPage.drawImage(chartImage, {
        x: margin,
        y: margin,
        width: 900,
        height: 600,
    });

    addFooter(chartPage, helveticaFont, textFontSize, margin);

    // Save the PDF to the file
   
        const finalPdfBytes = await pdfDoc.save();
        await savePdf(year, term, stream ,fileName,finalPdfBytes )
        const success = `Successfully Generated ${fileName} Results Can Print Them ..`
        
        return  success
    }catch(error){
        const err = `error occured while generating result pdf ${error}`
        return err;
    }
    
};

const generateClassPerformanceChart = async (gradedStudents) => {
    const width = 800; // px
    const height = 600; // px
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

    const data = {
        labels: gradedStudents.map(student => student.rank.toString()),
        datasets: [{
            label: 'Total Points',
            data: gradedStudents.map(student => student.totalPoints),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false,
        }]
    };

    const configuration = {
        type: 'line',
        data: data,
        options: {
            scales: {
                x: { title: { display: true, text: 'Rank' } },
                y: { title: { display: true, text: 'Total Points' } },
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Class Performance',
                },
            },
        },
    };

    return await chartJSNodeCanvas.renderToBuffer(configuration);
};

const addFooter = (page, font, fontSize, margin) => {
    const footerText = 'Results Generated by Matinyani Mixed Secondary School';
    const textWidth = font.widthOfTextAtSize(footerText, fontSize);
    const x = (page.getWidth() - textWidth) / 2;
    const y = margin / 2;

    page.drawText(footerText, {
        x: x,
        y: y,
        size: fontSize,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
    });
};

module.exports = { generateClassListForm, saveGradedStudents };
