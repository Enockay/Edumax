// models/Pdf.js
const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
    year : String,
    term : String,
    class : String,
    fileName: String,
    data: Buffer, // Ensure the data field is a Buffer
    contentType: String
});

const PdfModel = mongoose.model('pdfResults', pdfSchema);

module.exports = PdfModel;
