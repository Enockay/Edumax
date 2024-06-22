const express = require("express");
const transcript = express.Router();
const  { ProducedResults } = require("../../public/models/feedStudentMarks");

transcript.get("/transcript",async(req,res)=>{
    try{
        const {admission,stream} = req.query;
        //console.log(req.query);

        const query = {stream,studentAdmission:admission};
        //console.log(query)

        const Grades =  await ProducedResults.findOne(query);
        //console.log(Grades)
        if(Grades){
            res.status(200).json({success:true,message:Grades})
        }else{
            res.status(404).json({success:false ,message:"student Data not Found"});
        }
    }catch(error){
        res.status(500).json("Internal server Error")
    }
    
});

module.exports = transcript;