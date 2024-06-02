import React, { useState, useEffect } from "react";
import "./css/Assigment.css";
import {jwtDecode}  from "jwt-decode";

const Assignment = () => {
    const [assignments, setAssignments] = useState([]);
    const [week, setWeek] = useState(1);
    const [className, setClassName] = useState("");
    const [subject, setSubject] = useState("");
    const [assignmentText, setAssignmentText] = useState("");
    const [loading, setLoading] = useState(false);
    const [teacherName, setTeacherName] = useState("");
    const [error, setError] = useState(null);
    const [assError , setAssError] = useState('');

    useEffect(() => {
        const decodeTeacherName = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                const decodedToken = await  jwtDecode(token);
                const name = decodedToken.name
                fetchAssignments(decodedToken.name);
                setTeacherName(name);
               
                return name;
            }
        };
        const name = decodeTeacherName();
       
    }, []);
    
    const fetchAssignments = async (name) => {
        try {
            const response = await fetch(`https://edumax.fly.dev/ass/api/assignments/${name}`);
            if (!response.ok) {
                throw new Error(`Error fetching assignments: ${response.statusText}`);
            }
            const data = await response.json();
            if(data.length > 0){
                setAssignments(data)
            }else{
                setAssError("No assignment Saved Yet")
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
            setError(error.message);
        }
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const newAssignment = {
            week,
            className,
            subject,
            assignmentText,
            teacherName
        };
        try {
            const response = await fetch(`https://edumax.fly.dev/ass/api/assignments/${teacherName}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newAssignment)
            });
            if (!response.ok) {
                throw new Error(`Error adding assignment: ${response.statusText}`);
            }
            const addedAssignment = await response.json();
            setAssignments([...assignments, addedAssignment]);
            setWeek(1);
            setClassName("");
            setSubject("");
            setAssignmentText("");
            setLoading(false);
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    const handleCleanup = async () => {
        try {
            const response = await fetch(`https://edumax.fly.dev/ass/api/assignments/cleanup/${teacherName}`, {
                method: "DELETE"
            });
            if (!response.ok) {
                throw new Error(`Error cleaning up assignments: ${response.statusText}`);
            }
            setAssignments([]);
            console.log("All assignments have been cleaned up.");
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    return (
        <div className="assignment-container">
            <div className="assignment-form-card">
                <form className="assignment-form">
                    <select value={week} onChange={(e) => setWeek(e.target.value)}>
                        {Array.from({ length: 10 }, (_, i) => (
                            <option key={i} value={i + 1}>
                                Week {i + 1}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Class"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Assignment"
                        value={assignmentText}
                        onChange={(e) => setAssignmentText(e.target.value)}
                        required
                    ></textarea>
                    <button type="submit" onClick={handleSubmit}>Save Assignment</button>
                    <center>
                        {loading && <div className="spinning"></div>}
                    </center>
                    {error && <div className="error">{error}</div>}
                </form>
            </div>
            <div className="assignment-list-card">
                <h2 style={{ margin: 0, fontSize: "0.9rem", color: "blue" }}>Past Assignments</h2>
               
                <div className="assignments-list">
                    {assignments.map((assignment, index) => (
                        <div key={index} className="assignment-card">
                            <h3>Week {assignment.week}</h3>
                            <p><strong>Class:</strong> {assignment.className}</p>
                            <p><strong>Subject:</strong> {assignment.subject}</p>
                            <p><strong>Assignment:</strong> {assignment.assignmentText}</p>
                         <center><button onClick={handleCleanup}>Clean Up All Assignments</button> </center>  
                        </div>
                        
                    ))}
                </div>
                {assError && <div >{assError}</div>}
            </div>
        </div>
    );
};

export default Assignment;
