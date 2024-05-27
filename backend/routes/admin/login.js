const express = require('express');

const login = express.Router();

login.post('/login',(req,res)=>{

    const { username, password } = req.body;

    if(username === 'admin' && password === 'admin'){
        res.status(200).json({ success : true})
    }else{
        res.status(204).json({success : false})
    }
});

module.exports = login