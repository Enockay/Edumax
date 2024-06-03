import React, { useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import '../css/DeleteStudent.css';

const DeleteStudent = () => {
    const [selectedAdmissionNumber, setSelectedAdmissionNumber] = useState('');
    const [studentData, setStudentData] = useState(null);
    const [stream, setStream] = useState('');
    const [classes, setClass] = useState(['1East', '1West', '2East', '2West', '3East', '3West', '4East', '4West']);
    const [error, setError] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchStudentData = async (admissionNumber) => {
        const url = `https://edumax.fly.dev/students/${stream}/${admissionNumber}`;
        const uri = `http://localhost:3000/students/${stream}/${admissionNumber}`;

        try {
            setIsLoading(true);
            const response = await axios.get(url);
            if (response.data[0]) {
                setStudentData(response.data[0]);
            } else {
                setFeedback(response.data);
            }
            setError('');
        } catch (err) {
            setStudentData('');
            setError('Student not found.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdmissionNumberChange = (e) => {
        setSelectedAdmissionNumber(e.target.value);
    };

    const handleFetchStudent = () => {
        fetchStudentData(selectedAdmissionNumber);
    };

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setStudentData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        if (!studentData) {
            setError('No student selected or student data is incomplete.');
            return;
        }
        const url = `https://edumax.fly.dev/students/${stream}/${selectedAdmissionNumber}`;
        const uri = `http://localhost:3000/students/${stream}/${selectedAdmissionNumber}`;

        setError('');
        try {
            const response = await axios.put(url, studentData);
            setFeedback(response.data);
        } catch (err) {
            setError('Failed to update student data.');
        }
    };

    const handleDeleteStudent = async () => {
       
        const url = `https://edumax.fly.dev/students/${stream}/${selectedAdmissionNumber}`;
        const uri = `http://localhost:3000/students/${stream}/${selectedAdmissionNumber}`;

        if (!studentData) {
            setError('No student selected.');
            return;
        }
        setError('');
        try {
            setIsLoading(true);
            const response = await axios.delete(url);
            setSelectedAdmissionNumber('');
            setStudentData(null);
            setFeedback(response.data);
        } catch (err) {
            setError('Failed to delete student data.');
            setIsLoading(false);
        }
    };

    return (
        <>
          {/* Green flag */}
      <div className="green-flag">
        <div>
        <h3>How to Use This Form</h3>
        <p>Follow these steps to update student information:</p>
        <ul>
          <li>Enter the admission number && Stream in the Empty fields.</li>
          <li>Click the 'Fetch' button to retrieve the student's information.</li>
          <li>If no information is displayed, the student may not be registered in the system.</li>
        </ul>
        </div>
      </div>
        <div className="delete-student-container">
            <center><h2 className="delete-student-title">Update Student Information</h2></center>
            <div className="delete-student-form-row">
                <div className="delete-student-form-group">
                    <label>Admission Number:</label>
                    <input
                        type="text"
                        className="delete-student-input"
                        value={selectedAdmissionNumber}
                        onChange={handleAdmissionNumberChange}
                    />
                </div>
                <div className="delete-student-form-group">
                    <label>Select Stream:</label>
                    <select value={stream} onChange={(e) => setStream(e.target.value)} className="delete-student-select">
                        <option value="">--Select--</option>
                        {classes.map((className, index) => (
                            <option key={index} value={className}>{className}</option>
                        ))}
                    </select>
                </div>
                <div className="delete-student-form-group">
                    <button className="delete-student-button" onClick={handleFetchStudent} disabled={!stream || !selectedAdmissionNumber}>
                        {isLoading ? <ClipLoader size={50} color={"#fff"} /> : "Fetch Student"}
                    </button>
                </div>
            </div>
            {error && <div className="delete-student-error">{error}</div>}
            {studentData && (
                <form onSubmit={handleUpdateStudent} className="delete-student-update-form">
                    <fieldset className="delete-student-fieldset">
                        <legend className="delete-student-legend">Personal Information</legend>
                        <div className="delete-student-flex-container">
                            <div className="delete-student-flex-item">
                                <label>Full Name:</label>
                                <input
                                    type="text"
                                    className="delete-student-input"
                                    name="fullName"
                                    value={studentData.fullName}
                                    onChange={handleFieldChange}
                                />
                            </div>
                            <div className="delete-student-flex-item">
                                <label>Guardian Name:</label>
                                <input
                                    type="text"
                                    className="delete-student-input"
                                    name="guardianName"
                                    value={studentData.guardianName}
                                    onChange={handleFieldChange}
                                />
                            </div>
                            <div className="delete-student-flex-item">
                                <label>Guardian Tel:</label>
                                <input
                                    type="text"
                                    className="delete-student-input"
                                    name="guardianTel"
                                    value={studentData.guardianTel}
                                    onChange={handleFieldChange}
                                />
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className="delete-student-fieldset">
                        <legend className="delete-student-legend">Academic Information</legend>
                        <div className="delete-student-flex-container">
                            <div className="delete-student-flex-item">
                                <label>K.C.P.E Index:</label>
                                <input
                                    type="text"
                                    className="delete-student-input"
                                    name="kcpeIndex"
                                    value={studentData.kcpeIndex}
                                    onChange={handleFieldChange}
                                />
                            </div>
                            <div className="delete-student-flex-item">
                                <label>K.C.P.E Marks:</label>
                                <input
                                    type="text"
                                    className="delete-student-input"
                                    name="kcpeMarks"
                                    value={studentData.kcpeMarks}
                                    onChange={handleFieldChange}
                                />
                            </div>
                            <div className="delete-student-flex-item">
                                <label>Former School:</label>
                                <input
                                    type="text"
                                    className="delete-student-input"
                                    name="formerSchool"
                                    value={studentData.formerSchool}
                                    onChange={handleFieldChange}
                                />
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className="delete-student-fieldset">
                        <legend className="delete-student-legend">Other Information</legend>
                        <div className="delete-student-flex-container">
                            <div className="delete-student-flex-item">
                                <label>Student Birth Date:</label>
                                <input
                                    type="date"
                                    className="delete-student-input"
                                    name="studentBirthNo"
                                    value={studentData.studentBirthNo}
                                    onChange={handleFieldChange}
                                />
                            </div>
                            <div className="delete-student-flex-item">
                                <label>Date of Admission:</label>
                                <input
                                    type="date"
                                    className="delete-student-input"
                                    name="dateOfAdmission"
                                    value={studentData.dateOfAdmission}
                                    onChange={handleFieldChange}
                                />
                            </div>
                            <div className="delete-student-flex-item">
                                <label>Gender:</label>
                                <select
                                    className="delete-student-input"
                                    name="gender"
                                    value={studentData.gender}
                                    onChange={handleFieldChange}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div className="delete-student-flex-item">
                                <label>Boarding or Day:</label>
                                <input
                                    type="text"
                                    className="delete-student-input"
                                    name="boardingOrDay"
                                    value={studentData.boardingOrDay}
                                    onChange={handleFieldChange}
                                />
                            </div>
                        </div>
                    </fieldset>
                   
                    <div className="delete-student-buttons">
                        <div className="spinner-container">
                            {isLoading ? <ClipLoader size={50} color={"#000"} /> :
                                <>
                                    <button type="submit" disabled={isLoading} className="btn btn-success btn-block">Update Student</button>
                                    <button type="button" disabled={isLoading} className="btn btn-danger btn-block" onClick={handleDeleteStudent}>Delete Student</button>
                                </>
                            }
                        </div>
                    </div>
                </form>
            )}
            <div className='delete-student-feedback'>{feedback}</div>
        </div>
        </>
    );
};

export default DeleteStudent;
