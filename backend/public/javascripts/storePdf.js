const PdfModel = require('../models/pdfSchema');

const savePdf = async (fileName, pdfBytes) => {
    try {
        const pdfBuffer = Buffer.from(pdfBytes); // Convert Uint8Array to Buffer
        const pdfDocument = new PdfModel({
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

