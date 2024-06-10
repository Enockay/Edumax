// models/feesReportSchema.js
const mongoose = require('mongoose');

const FeesReportSchema = new mongoose.Schema({
    stream: { type: String, required: true },  // e.g., 1East, 2West, etc.
    year: { type: Number, required: true },    // e.g., 2024
    term: { type: String, required: true },    // e.g., Term1, Term2, Term3
    date: { type: String, required: true },    // Date in YYYY-MM-DD format
    reportData: [{
        adm: String,
        fullName: String,
        time: String,
        levi:String,  // Time in HH:MM:SS format
        feesPaid: Number,
        gender: String,
        stream: String
    }],
    collector : {type : String,required: true}
}, { timestamps: true });

module.exports = mongoose.model('FeesReport', FeesReportSchema);
