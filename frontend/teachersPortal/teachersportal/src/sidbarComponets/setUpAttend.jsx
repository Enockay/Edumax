import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/setUp.css";
import { ClipLoader } from "react-spinners";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {jwtDecode} from "jwt-decode";

const SetupAttendance = () => {
    const [years] = useState(["2024", "2025", "2026", "2027"]);
    const [terms] = useState(["Term 1", "Term 2", "Term 3"]);
    const [streams] = useState(["1West", "1East", "2West", "2East", "3West", "3East", "4West", "4East"]);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedTerm, setSelectedTerm] = useState('');
    const [uniqueId, setUniqueId] = useState('');
    const [stream, setStream] = useState('');
    const [weeksCount, setWeeksCount] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [token, setToken] = useState('');

    useEffect(() => {
        const fetchToken = async () => {
            const tokenItem = localStorage.getItem("token");
            setToken(tokenItem);
        }
        fetchToken();
    }, []);

    const handleStreamChange = async (e) => {
        const selectedStream = e.target.value;
        setStream(selectedStream);
        setStudents([]);
        if (selectedStream) {
            setLoading(true);
            setMessage(null);
            try {
                const response = await axios.get(`https://edumax.fly.dev/attend/students?stream=${selectedStream}`);
                const studentData = Array.isArray(response.data) ? response.data : [];
                setStudents(studentData);
            } catch (error) {
                console.error("Error fetching students:", error);
                setMessage({ type: 'error', text: 'Error fetching students. Please try again.' });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmit = async () => {
        const weeksData = Array.from({ length: weeksCount }, (_, weekIndex) => {
            const weekStartDate = new Date(startDate);
            weekStartDate.setDate(startDate.getDate() + weekIndex * 7);
            return {
                week: weekIndex + 1,
                students: students.map(student => ({
                    admissionNumber: student.admissionNumber,
                    fullName: student.fullName,
                    attendance: [
                        { date: new Date(weekStartDate), attendance: true },
                        { date: new Date(weekStartDate.setDate(weekStartDate.getDate() + 1)), attendance: true },
                        { date: new Date(weekStartDate.setDate(weekStartDate.getDate() + 1)), attendance: true },
                        { date: new Date(weekStartDate.setDate(weekStartDate.getDate() + 1)), attendance: true },
                        { date: new Date(weekStartDate.setDate(weekStartDate.getDate() + 1)), attendance: true }
                    ]
                })),
                startDate: weekStartDate.toISOString().split('T')[0]
            };
        });

        const attendanceData = {
            year: selectedYear,
            term: selectedTerm,
            uniqueId,
            stream,
            startDate: startDate.toISOString().split('T')[0],
            weeks: weeksData,
            token
        };

        setLoading(true);
        setMessage(null);
        try {
            await axios.post(`https://edumax.fly.dev/attend/setup-attendance`, attendanceData);
            setMessage({ type: 'success', text: 'Attendance sheet successfully created!' });
            setStudents([]);
            setStream('');
            setSelectedYear('');
            setSelectedTerm('');
            setUniqueId('');
            setWeeksCount(1);
            setStartDate(new Date());
        } catch (error) {
            console.error("Error creating attendance sheet:", error);
            setMessage({ type: 'error', text: 'Error creating attendance sheet. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="setup-attendance-container">
            <h2>Setup Attendance Sheet</h2>
            {message && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}
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
                <label>Stream:</label>
                <select value={stream} onChange={handleStreamChange} required>
                    <option value="">Select Stream</option>
                    {streams.map((stream, index) => (
                        <option key={index} value={stream}>{stream}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Number of Weeks:</label>
                <input type="number" value={weeksCount} onChange={e => setWeeksCount(Number(e.target.value))} min="1" required />
            </div>
            <div>
                <label>Start Date:</label>
                <DatePicker selected={startDate} onChange={date => setStartDate(date)} required />
            </div>
            {loading && (
                <div className="loading-spinner">
                    <ClipLoader size={35} color="#007bff" />
                </div>
            )}
            <div className="students-container">
                <h3>Students</h3>
                <div className="students-list">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>ADM No</th>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr key={index} className="student-entry">
                                    <td>{index + 1}</td>
                                    <td>{student.admissionNumber}</td>
                                    <td>{student.fullName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <button onClick={handleSubmit} className="submit-button" disabled={loading}>
                {loading ? <ClipLoader size={15} color="#fff" /> : 'Create Attendance Sheet'}
            </button>
        </div>
    );
};

export default SetupAttendance;
