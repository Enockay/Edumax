import React, { useState, useEffect } from "react";
import "./css/Assigment.css";

const Assignment = () => {
    const [assignments, setAssignments] = useState([]);
    const [week, setWeek] = useState(1);
    const [className, setClassName] = useState("");
    const [subject, setSubject] = useState("");
    const [assignmentText, setAssignmentText] = useState("");

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const response = await fetch("/api/assignments"); // Change to your API endpoint
            const data = await response.json();
            setAssignments(data);
        } catch (error) {
            console.error("Error fetching assignments:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newAssignment = {
            week,
            className,
            subject,
            assignmentText
        };
        try {
            const response = await fetch("/api/assignments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newAssignment)
            });
            if (response.ok) {
                const addedAssignment = await response.json();
                setAssignments([...assignments, addedAssignment]);
                // Reset form
                setWeek(1);
                setClassName("");
                setSubject("");
                setAssignmentText("");
            } else {
                console.error("Error adding assignment");
            }
        } catch (error) {
            console.error("Error adding assignment:", error);
        }
    };

    return (
        <div className="assignment-container">
            <div className="assignment-form-card">
                <form className="assignment-form" onSubmit={handleSubmit}>
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
                    <button type="submit">Save Assignment</button>
                </form>
            </div>
            <div className="assignment-list-card">
                <h2 style={{margin:0,fontSize:"0.9rem",color:"blue"}}>Past Assignments</h2>
                <div className="assignments-list">
                    {assignments.map((assignment, index) => (
                        <div key={index} className="assignment-card">
                            <h3>Week {assignment.week}</h3>
                            <p><strong>Class:</strong> {assignment.className}</p>
                            <p><strong>Subject:</strong> {assignment.subject}</p>
                            <p><strong>Assignment:</strong> {assignment.assignmentText}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Assignment;
