// routes/downloadResults.js
const express = require('express');
const Pdf = require('../../public/models/pdfSchema');  // Import the Pdf model

const downloadResults = express.Router();

downloadResults.get('/download-pdf/:fileName', async (req, res) => {
    const fileName = req.params.fileName;
    console.log('Requested fileName:', fileName);

    try {
        const pdf = await Pdf.findOne({ fileName });  // Use findOne if expecting a single document
        if (!pdf) {
            console.log('PDF not found in database');
            return res.status(404).send('Results not Found In the Database Maybe not generated');
        }

        //console.log('PDF found:', pdf);
        //console.log('PDF contentType:', pdf.contentType);
        //console.log('PDF fileName:', pdf.fileName);
        
        if (!pdf.contentType || !pdf.data) {
            console.log('PDF missing required fields');
            return res.status(500).send('Internal Server Error: PDF is missing required fields');
        }

        res.setHeader('Content-Type', pdf.contentType);
        res.setHeader('Content-Disposition', `attachment; filename=${pdf.fileName}`);
        res.send(pdf.data);
    } catch (error) {
        console.error('Error fetching PDF:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = downloadResults;
