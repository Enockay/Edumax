import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./css/attendancd.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const AttendanceSheet = () => {
    const { term, year, stream, weeks, students } = "";
    const [attendance, setAttendance] = useState([]);
    const [currentWeek, setCurrentWeek] = useState(0);

    useEffect(() => {
        // Fetch existing attendance data if available
        axios.get(`/api/attendance?term=${term}&year=${year}&stream=${stream}`)
            .then(response => {
                setAttendance(response.data);
            })
            .catch(error => {
                console.error("Error fetching attendance data:", error);
            });
    }, [term, year, stream]);

    const handleMarkAttendance = (studentId, dayIndex) => {
        setAttendance(prevState => {
            const newState = [...prevState];
            newState[currentWeek][studentId][dayIndex] = !newState[currentWeek][studentId][dayIndex];
            return newState;
        });
    };

    const handleSubmit = () => {
        axios.post('/api/attendance', { term, year, stream, attendance })
            .then(response => {
                alert("Attendance successfully submitted!");
            })
            .catch(error => {
                console.error("Error submitting attendance:", error);
            });
    };

    const generateInitialAttendance = () => {
        let initialAttendance = [];
        for (let week = 0; week < weeks; week++) {
            let weekData = {};
            students.forEach(student => {
                weekData[student.id] = Array(5).fill(false); // Initialize with false (absent)
            });
            initialAttendance.push(weekData);
        }
        return initialAttendance;
    };

    useEffect(() => {
        if (attendance.length === 0) {
            setAttendance(generateInitialAttendance());
        }
    }, [students, weeks, attendance.length]);

    return (
        <div className="attendance-container">
            <h2>Attendance Sheet - {stream} - Term {term} - Year {year}</h2>
            <div className="week-navigation">
                {Array.from({ length: weeks }, (_, index) => (
                    <button key={index} className={currentWeek === index ? "active" : ""}
                            onClick={() => setCurrentWeek(index)}>
                        Week {index + 1}
                    </button>
                ))}
            </div>
            <div className="attendance-sheet">
                <table>
                    <thead>
                        <tr>
                            <th>Admission No.</th>
                            <th>Student Name</th>
                            {Array.from({ length: 5 }, (_, index) => (
                                <th key={index}>Day {index + 1}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.id}>
                                <td>{student.admission}</td>
                                <td>{student.name}</td>
                                {attendance[currentWeek][student.id].map((present, index) => (
                                    <td key={index} onClick={() => handleMarkAttendance(student.id, index)}
                                        className={present ? "present" : "absent"}>
                                        <FontAwesomeIcon icon={present ? faCheck : faTimes} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={handleSubmit} className="submit-button">Submit</button>
        </div>
    );
};



export default AttendanceSheet;
