const express = require("express");
const generateResults = express.Router();
const generateResult = require('../../public/javascripts/produceResults');

generateResults.post('/generateResult', async (req, res) => {
    try {
        const { stream, term, Teacher,year,exams} = req.body;
        console.log(req.body);
        const fileName = `Form ${stream} Results.pdf`;
        const pdfBuffer = await generateResult(stream, term, Teacher,year,exams,fileName); 
        res.status(200).json(pdfBuffer);
    } catch (error) {
        console.log(error);
        res.status(400).json(`Error occurred while producing results: ${error}`);
    }
});

module.exports = generateResults;

