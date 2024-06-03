import React, { useState } from 'react';
import '../css/FilterStudent.css';

const FilterStudent = () => {
    const [admissionNumber, setAdmissionNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');

    const handleAdmissionNumberChange = (e) => {
        setAdmissionNumber(e.target.value);
    };

    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
    };

    const handleSearch = () => {
        if (!admissionNumber && !firstName && !lastName) {
            setError('Please provide at least one search criteria.');
            return;
        }

        setError('');

        // Dummy data for demonstration
        const dummyStudents = [
            { adm: '1234', fullName: 'John Doe', form: 'Form 4', gender: 'Male' },
            { adm: '5678', fullName: 'Jane Smith', form: 'Form 3', gender: 'Female' },
            { adm: '9101', fullName: 'Michael Johnson', form: 'Form 2', gender: 'Male' },
            { adm: '1121', fullName: 'Emily Davis', form: 'Form 1', gender: 'Female' },
        ];

        const filteredStudents = dummyStudents.filter(student => {
            return (
                (admissionNumber && student.adm.includes(admissionNumber)) ||
                (firstName && student.fullName.toLowerCase().includes(firstName.toLowerCase())) ||
                (lastName && student.fullName.toLowerCase().includes(lastName.toLowerCase()))
            );
        });

        setStudents(filteredStudents);
    };

    return (
        <div className="filter-student-container">
            <h2>Filter Student</h2>
            <div className="upd-search-form">
                <div className="form-group">
                    <label>Admission Number:</label>
                    <input type="text" value={admissionNumber} onChange={handleAdmissionNumberChange} />
                </div>
                <div className="form-group">
                    <label>First Name:</label>
                    <input type="text" value={firstName} onChange={handleFirstNameChange} />
                </div>
                <div className="form-group">
                    <label>Last Name:</label>
                    <input type="text" value={lastName} onChange={handleLastNameChange} />
                </div>
                <button type="button" onClick={handleSearch}>Search</button>
            </div>
            {error && <div className="error-message">{error}</div>}
            {students.length > 0 ? (
                <div className="students-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Admission Number</th>
                                <th>Full Name</th>
                                <th>Form</th>
                                <th>Gender</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr key={index}>
                                    <td>{student.adm}</td>
                                    <td>{student.fullName}</td>
                                    <td>{student.form}</td>
                                    <td>{student.gender}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="no-students-message">No students found.</div>
            )}
        </div>
    );
};

export default FilterStudent;

