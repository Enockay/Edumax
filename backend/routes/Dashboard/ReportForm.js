const express = require("express");
const reportForm = express.Router();

const generateReportform = require("../../public/javascripts/studentReportForm");

reportForm.post('/generate/reportForms',async (req,res)=>{
    const { year, stream, term, examType } = req.body;
  try {
    const result = await generateReportform(year, stream, term, examType);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.toString());
  }
})

module.exports = reportForm;