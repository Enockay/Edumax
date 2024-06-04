const PdfModel = require('../models/pdfSchema');

const savePdf = async (year, term, classes ,fileName, pdfBytes) => {
    try {
        const pdfBuffer = Buffer.from(pdfBytes); // Convert Uint8Array to Buffer
        const pdfDocument = new PdfModel({
            year : year,
            term : term,
            class : classes,
            fileName: fileName,
            data: pdfBuffer,
            contentType: 'application/pdf'
        });

        await pdfDocument.save();
        console.log(`PDF ${fileName} saved successfully to MongoDB`);
    } catch (error) {
        console.error('Error saving PDF to MongoDB:', error);
    }
};

module.exports = savePdf;

