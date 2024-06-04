// models/Pdf.js
const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
    year : { type : String , required : true },
    term : { type : String, required : true },
    class : {type : String,  required : true },
    fileName: {type : String, required : true },
    data: {type : Buffer ,required : true },
    contentType: {type : String , required : true }
});

const PdfModel = mongoose.model('pdfResults', pdfSchema);

module.exports = PdfModel;
