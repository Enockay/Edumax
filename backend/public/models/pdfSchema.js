const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true }
});

const examTypeSchema = new mongoose.Schema({
    examType: { type: String, required: true },
    pdf: { type: pdfSchema, required: true }
});

const termSchema = new mongoose.Schema({
    term: { type: String, required: true },
    examTypes: [examTypeSchema]
});

const yearSchema = new mongoose.Schema({
    year: { type: String, required: true },
    terms: [termSchema]
});

const classSchema = new mongoose.Schema({
    class: { type: String, required: true },
    years: [yearSchema]
});

const ClassModel = mongoose.model('ClassResults', classSchema);

module.exports = ClassModel;
