// models/Pdf.js
const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
    fileName: String,
    data: Buffer, // Ensure the data field is a Buffer
    contentType: String
});

const PdfModel = mongoose.model('pdfResults', pdfSchema);

module.exports = PdfModel;
