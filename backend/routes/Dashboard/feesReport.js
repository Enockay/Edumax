const express = require('express');
const router = express.Router();
const FeesReport = require('../../public/models/feeReport');

// Middleware to check if user is super admin
const isSuperAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'super-admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Only super admin can access reports.' });
    }
};

router.get('/fetchFeesReports', async (req, res) => {
    const { stream, term, date } = req.query;
    console.log(req.query);
    
    let filter = {};

    if (stream) {
        filter.stream = stream;
    }else if (term) {
        filter.term = term;
    }else if (date) {
        filter.date = date;
    }else {
        filter.date = Date.now();
    }

    try {
        const reports = await FeesReport.find(filter).sort({ date: -1 });
        
        const responseData = reports.map(report => ({
            _id: report._id,
            createdAt: report.createdAt,
            updatedAt: report.updatedAt,
            stream: report.stream,
            term: report.term,
            year: report.year,
            date: report.date,
            reportData: report.reportData || [],
            collector: report.collector // Ensure collector information is included
        }));
        res.json(responseData);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
