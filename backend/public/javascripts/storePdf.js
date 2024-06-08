const ClassModel = require('../models/pdfSchema'); 

const savePdf = async (year, term, classes, examType, fileName, pdfBytes) => {
    try {
        const pdfBuffer = Buffer.from(pdfBytes); // Convert Uint8Array to Buffer

        // Find the class document
        let classDoc = await ClassModel.findOne({ class: classes });

        if (!classDoc) {
            // Create a new class document with the entire hierarchy if it doesn't exist
            classDoc = new ClassModel({
                class: classes,
                years: [{
                    year: year,
                    terms: [{
                        term: term,
                        examTypes: [{
                            examType: examType,
                            pdf: {
                                fileName: fileName,
                                data: pdfBuffer,
                                contentType: 'application/pdf'
                            }
                        }]
                    }]
                }]
            });
        } else {
            // Find or create the year document within the class
            let yearDoc = classDoc.years.find(y => y.year === year);
            if (!yearDoc) {
                yearDoc = { year: year, terms: [{
                        term: term,
                        examTypes: [{
                            examType: examType,
                            pdf: {
                                fileName: fileName,
                                data: pdfBuffer,
                                contentType: 'application/pdf'
                            }
                        }]
                    }] };
                classDoc.years.push(yearDoc);
            } else {
                // Find or create the term document within the year
                let termDoc = yearDoc.terms.find(t => t.term === term);
                if (!termDoc) {
                    termDoc = { term: term, examTypes: [{
                            examType: examType,
                            pdf: {
                                fileName: fileName,
                                data: pdfBuffer,
                                contentType: 'application/pdf'
                            }
                        }] };
                    yearDoc.terms.push(termDoc);
                } else {
                    // Find or create the exam type document within the term
                    let examTypeDoc = termDoc.examTypes.find(e => e.examType === examType);
                    if (!examTypeDoc) {
                        examTypeDoc = {
                            examType: examType,
                            pdf: {
                                fileName: fileName,
                                data: pdfBuffer,
                                contentType: 'application/pdf'
                            }
                        };
                        termDoc.examTypes.push(examTypeDoc);
                    } else {
                        // Update the existing exam type document
                        examTypeDoc.pdf = {
                            fileName: fileName,
                            data: pdfBuffer,
                            contentType: 'application/pdf'
                        };
                    }
                }
            }
        }

        // Save the updated class document
        await classDoc.save();
        console.log(`PDF ${fileName} saved successfully to MongoDB`);
    } catch (error) {
        console.error('Error saving PDF to MongoDB:', error);
    }
};

module.exports = savePdf;
