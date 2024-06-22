const express = require("express");
const student = require("../../public/models/admitStudentSchema");

const studentLogin = express.Router();
const streams = ["1East", "1West", "2East", "2West", "3East", "3West", "4East", "4West"];

studentLogin.post("/parent/login", async (req, res) => {
    try {
        const { admission, password } = req.body;
        console.log(admission);

        const studentPromises = streams.map(async (stream) => {
            const model = await student(stream); // Assuming `student` is a function that returns a Mongoose model
            return model.findOne({ admissionNumber: admission });
        });

        // Use Promise.allSettled to handle all promises and find the first resolved one
        const results = await Promise.allSettled(studentPromises);
        
        let studentFound = null;
        for (const result of results) {
            if (result.status === "fulfilled" && result.value) {
                studentFound = result.value;
                break; // Exit the loop once the student is found
            }
        }

        if (studentFound) {
            res.status(200).json({ success: true, message: studentFound });
        } else {
            res.status(404).json({ success: false, message: "Student not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = studentLogin;
