const express = require('express');
const jwt = require('jsonwebtoken');
const teacherLoginModel = require('../../public/models/teacherslogin');
const teacher = express.Router();
const bcrypt = require('bcryptjs');

teacher.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const key = 'aOpJFUXdhe4Nt5i5RAKzbuStAPCLK5joDSqqUlfdtZg=';

    try {
        const user = await teacherLoginModel.findOne({ username });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(300).json({ message: 'Invalid credentials' });
        }

        // Extract user profile information
        const { _id, name, email, gender } = user;

        // Create JWT token with user profile information
        const token = jwt.sign({ id: _id, name, email, gender }, key, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

teacher.post('/register', async (req, res) => {
    const { username, password, email, name, gender, phone, address, department, TSC } = req.body;

    try {
        // Check if the email exists in the system
        const existingTeacher = await teacherLoginModel.findOne({ email });
        if (!existingTeacher) {
            return res.status(401).json({ message: 'Unauthorized to the system' });
        }
        
        if(existingTeacher.password || existingTeacher.username){
            return res.status(400).json({message : 'This Email is already Registered'})
        }
        // Update the existing teacher entry with the remaining details
        existingTeacher.username = username;
        existingTeacher.password = password;
        existingTeacher.name = name;
        existingTeacher.gender = gender;
        existingTeacher.phone = phone;
        existingTeacher.address = address;
        existingTeacher.department = department;
        existingTeacher.TSC = TSC;

        // Save the updated teacher to the database
        await existingTeacher.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

teacher.put('/update-profile', async (req, res) => {
    const { token, name, email, gender, phone, address, department, TSC } = req.body;
    const key = 'aOpJFUXdhe4Nt5i5RAKzbuStAPCLK5joDSqqUlfdtZg=';
    
    try {
        const decoded = jwt.verify(token, key);
        const user = await teacherLoginModel.findById(decoded.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        user.name = name;
        user.email = email;
        user.gender = gender;
        user.phone = phone;
        user.address = address;
        user.department = department;
        user.TSC = TSC;

        await user.save();
        
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

teacher.put('/change-password', async (req, res) => {
    const { token, currentPassword, newPassword } = req.body;
    const key = 'aOpJFUXdhe4Nt5i5RAKzbuStAPCLK5joDSqqUlfdtZg=';
    
    try {
        const decoded = jwt.verify(token, key);
        const user = await teacherLoginModel.findOne({name:decoded.name});
        
        if (!user || !(await user.matchPassword(currentPassword))) {
            return res.status(300).json({ message: 'Invalid current password' });
        }

        user.password = newPassword;
        user.name = decoded.name;
        await user.save();
        
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
});
teacher.post("/profile",async(req,res)=>{
    const {token} = req.body;
    //console.log(req.body)
    const key = 'aOpJFUXdhe4Nt5i5RAKzbuStAPCLK5joDSqqUlfdtZg=';
    try{
     const decoded = await jwt.verify(token,key);
     const profile = await teacherLoginModel.find({name:decoded.name});
    
     if(profile.length > 0){
        res.status(200).json({success:true,message:profile})
     }else{
        res.status(300).json({success:false,message:"no data found"})
     }
    }catch(error){
        console.log(error)
        res.status(500).json("internal server error")
    }
})
module.exports = teacher;
