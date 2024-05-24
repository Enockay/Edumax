import React, { useState } from 'react';
import './FeesReport.css';

const FeesReport = () => {
    const [form, setForm] = useState('');
    const [date, setDate] = useState('');
    const [day, setDay] = useState('');
    const [report, setReport] = useState([]);
    const [error, setError] = useState('');

    const handleFormChange = (e) => {
        setForm(e.target.value);
    };

    const handleDateChange = (e) => {
        setDate(e.target.value);
    };

    const handleDayChange = (e) => {
        setDay(e.target.value);
    };

    const handleGenerateReport = () => {
        if (!form || !date || !day) {
            setError('All fields must be filled out to generate the report.');
            return;
        }

        setError('');

        // Dummy data for demonstration
        const dummyReportData = [
            { adm: '1234', fullName: 'John Doe', date: '2024-05-01', time: '10:00 AM', feesPaid: '$500', gender: 'Male', form: 'Form 4' },
            { adm: '5678', fullName: 'Jane Smith', date: '2024-05-01', time: '11:00 AM', feesPaid: '$450', gender: 'Female', form: 'Form 4' },
            // Add more dummy data as needed
        ];
        setReport(dummyReportData);
    };

    return (
        <div className="fees-report-container">
            <h2>Fees Report</h2>
            <div className="filter-form">
                <div className="form-group">
                    <label>Select Form:</label>
                    <select value={form} onChange={handleFormChange}>
                        <option value="">Select Form</option>
                        <option value="Form 4">Form 4</option>
                        <option value="Form 3">Form 3</option>
                        <option value="Form 2">Form 2</option>
                        <option value="Form 1">Form 1</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Select Date:</label>
                    <input type="date" value={date} onChange={handleDateChange} />
                </div>
                <div className="form-group">
                    <label>Select Day:</label>
                    <select value={day} onChange={handleDayChange}>
                        <option value="">Select Day</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                    </select>
                </div>
                <button type="button" onClick={handleGenerateReport}>Generate Report</button>
            </div>
            {error && <div className="error-message">{error}</div>}
            {report.length > 0 && (
                <div className="report-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Admission Number</th>
                                <th>Full Name</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Fees Paid</th>
                                <th>Gender</th>
                                <th>Form</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.map((entry, index) => (
                                <tr key={index}>
                                    <td>{entry.adm}</td>
                                    <td>{entry.fullName}</td>
                                    <td>{entry.date}</td>
                                    <td>{entry.time}</td>
                                    <td>{entry.feesPaid}</td>
                                    <td>{entry.gender}</td>
                                    <td>{entry.form}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default FeesReport;

