const express = require("express");
const teacherLoginModel = require("../../public/models/teacherslogin");
const profile = express.Router();
const ensureAuthenticated = require("./Auth");

profile.get("/profile/:id",async (req,res)=>{
    try{
    const username = req.params.id
    const teacherProfile = await teacherLoginModel.find({ username });
   //console.log(teacherProfile)
    res.status(200).json(teacherProfile);
}catch(error){

    res.status(400).send(error.message)
}
    
});

module.exports = profile