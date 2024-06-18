import React, { useState, useEffect } from "react";
import axios from "axios";
import './css/attendancd.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ClipLoader } from "react-spinners";

const Attendance = () => {
    const [years] = useState(["2024", "2025", "2026", "2027"]);
    const [terms] = useState(["Term 1", "Term 2", "Term 3"]);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedTerm, setSelectedTerm] = useState('');
    const [uniqueId, setUniqueId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [attendanceData, setAttendanceData] = useState(null);
    const [currentWeek, setCurrentWeek] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [notes, setNotes] = useState({});
    const [classNotes, setClassNotes] = useState('');
    const [teacherName, setTeacherName] = useState('');

    const [modifiedAttendance, setModifiedAttendance] = useState({});
    const [modifiedNotes, setModifiedNotes] = useState({});
    const [modifiedClassNotes, setModifiedClassNotes] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setTeacherName(payload.name);
        }
    }, []);

    const handleFetchAttendance = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const response = await axios.get(`https://edumax.fly.dev/attend/attendance`, {
                params: { year: selectedYear, term: selectedTerm, uniqueId, teacherName }
            });
            setAttendanceData(response.data);
        } catch (error) {
            console.error("Error fetching attendance data:", error);
            setMessage({ type: 'error', text: 'Invalid details or no data available.' });
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAttendance = (studentId, dayIndex) => {
        const updatedData = { ...attendanceData };
        const student = updatedData.weeks[currentWeek].students.find(student => student._id === studentId);
        if (student) {
            student.attendance[dayIndex].attendance = !student.attendance[dayIndex].attendance;
            setAttendanceData(updatedData);

            // Track modified attendance
            setModifiedAttendance(prev => ({
                ...prev,
                [studentId]: {
                    ...prev[studentId],
                    [dayIndex]: student.attendance[dayIndex].attendance
                }
            }));
        }
    };

    const handleNoteChange = (studentId, dayIndex, value) => {
        setNotes(prevNotes => ({
            ...prevNotes,
            [studentId]: { ...(prevNotes[studentId] || {}), [dayIndex]: value }
        }));
        setModifiedNotes(prev => ({
            ...prev,
            [studentId]: { ...(prev[studentId] || {}), [dayIndex]: value }
        }));
    };

    const handleClassNoteChange = (value) => {
        setClassNotes(value);
        setModifiedClassNotes(prev => ({
            ...prev,
            [currentWeek]: value
        }));
    };

    const getDayDates = (startDate, weekIndex) => {
        const dates = [];
        const start = new Date(startDate);
        start.setDate(start.getDate() + weekIndex * 7);
        for (let i = 0; i < 5; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            dates.push(date.toLocaleDateString());
        }
        return dates;
    };

    const handleSubmit = async () => {
        setLoading(true);
        setMessage(null);
        try {
            await axios.post(`https://edumax.fly.dev/attend/attendance`, {
                uniqueId,
                modifiedAttendance,
                modifiedNotes,
                modifiedClassNotes,
            });
            setMessage({ type: 'success', text: 'Attendance successfully submitted!' });
            setAttendanceData(null)
        } catch (error) {
            console.error("Error submitting attendance:", error);
            setMessage({ type: 'error', text: 'Error submitting attendance. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="attendance-container">
            {message && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}
            {!attendanceData ? (
                <div className="fetch-form">
                    <h2>Retrieve Attendance Sheet</h2>
                    <form onSubmit={e => { e.preventDefault(); handleFetchAttendance(); }}>
                        <div>
                            <label>Year:</label>
                            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                                <option value="">Select year</option>
                                {years.map((year, index) => (
                                    <option key={index} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Term:</label>
                            <select value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)}>
                                <option value="">Select Term</option>
                                {terms.map((term, index) => (
                                    <option key={index} value={term}>{term}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Unique ID:</label>
                            <input type="text" value={uniqueId} onChange={e => setUniqueId(e.target.value)} required />
                        </div>
                        <div>
                            <label>Start Date:</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? <ClipLoader size={15} color="#fff" /> : 'Fetch Attendance'}
                        </button>
                    </form>
                </div>
            ) : (
                <>
                    <h2>Attendance Sheet - {attendanceData.stream} - Term {attendanceData.term} - Year {attendanceData.year}</h2>
                    <div className="week-navigation">
                        {attendanceData.weeks.map((_, index) => (
                            <button key={index} className={currentWeek === index ? "active" : ""}
                                onClick={() => setCurrentWeek(index)}>
                                Week {index + 1}
                            </button>
                        ))}
                    </div>
                    <div className="attendance-sheet">
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Admission No.</th>
                                        <th>Student Name</th>
                                        {getDayDates(startDate, currentWeek).map((date, index) => (
                                            <th key={index}>Week {currentWeek + 1} Day {index + 1} ({date})</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceData.weeks[currentWeek].students.map(student => (
                                        <tr key={student._id}>
                                            <td>{student.admissionNumber}</td>
                                            <td>{student.fullName}</td>
                                            {student.attendance.map((att, index) => (
                                                <td key={index} onClick={() => handleMarkAttendance(student._id, index)}
                                                    className={att.attendance ? "present" : "absent"}>
                                                    <FontAwesomeIcon icon={att.attendance ? faCheck : faTimes} />
                                                    <input
                                                        value={notes[student._id]?.[index] || ''}
                                                        onChange={(e) => handleNoteChange(student._id, index, e.target.value)}
                                                        placeholder="note"
                                                        style={{ padding: "0.3rem", maxWidth: "5.5rem", borderRadius: "0.4rem" }}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="class-note">
                            <label>Class Note:</label>
                            <textarea
                                value={classNotes}
                                onChange={(e) => handleClassNoteChange(e.target.value)}
                                placeholder="Write a note for the whole class"
                                style={{ width: "100%", padding: "0.5rem", borderRadius: "0.4rem" }}
                            />
                        </div>
                    </div>
                    <button onClick={handleSubmit} className="submit-button" disabled={loading}>
                        {loading ? <ClipLoader size={15} color="#fff" /> : 'Submit'}
                    </button>
                </>
            )}
        </div>
    );
};

export default Attendance;
