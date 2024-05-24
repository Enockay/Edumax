import React, { useState } from 'react';
import axios from 'axios';
import './DeleteStudent.css'; // Import your custom CSS file

const DeleteStudent = () => {
    const [selectedAdmissionNumber, setSelectedAdmissionNumber] = useState('');
    const [studentData, setStudentData] = useState('');
    const [stream , setStream ] = useState('');
    const [classes , setClass ] = useState(['1East','1West','2East','2West','3East','3West','4East','4West'])
    const [error, setError] = useState('');

    const fetchStudentData = async (admissionNumber) => {
        try {
            const response = await axios.get(`http://localhost:3000/students/${stream}/${admissionNumber}`);
            setStudentData(response.data[0]);
            console.log(response.data[0])
            setError('');
        } catch (err) {
            setStudentData('');
            setError('Student not found.');
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
        setError('');
        try {
            await axios.put(`http://localhost:3000/students/${stream}/${studentData.admissionNumber}`, studentData);
            alert('Student data updated successfully!');
        } catch (err) {
            setError('Failed to update student data.');
        }
    };

    const handleDeleteStudent = async () => {
        if (!studentData) {
            setError('No student selected.');
            return;
        }
        setError('');
        try {
            await axios.delete(`http://localhost:3000/students/${stream}/${studentData.admissionNumber}`);
            setSelectedAdmissionNumber('');
            setStudentData(null);
            alert('Student data deleted successfully!');
        } catch (err) {
            setError('Failed to delete student data.');
        }
    };

    return (
        <div className="container">
         <center><h2 className="text-center mt-4 mb-4"style={{color:'green',margin:0}}>Update Student Information</h2></center>   
            <div className="form-group-row">
                <label className="col-sm-2 col-form-label">Admission Number:</label>
                <div className="col-sm-8">
                    <input
                        type="text"
                        className="form-control"
                        value={selectedAdmissionNumber}
                        onChange={handleAdmissionNumberChange}
                    />
                </div>
                <label className="col-sm-2 col-form-label">Select Stream:</label>
                <div className="col-sm-8">
                    <select value = {stream} onChange={(e)=>setStream(e.target.value)}>
                       <option className=''>--Select--</option>
                       {classes.map((className,index) => (
                         <option key={index} value={className}>{className}</option>
                       ))}
                    </select>
                </div>
                <div className="col-sm-2">
                  <center><button className="btn-primary" onClick={handleFetchStudent}disabled={!stream ||!selectedAdmissionNumber}>Fetch Student</button></center>
                </div>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {studentData && (
                <form onSubmit={handleUpdateStudent} className="">
                    <div className='mt-4'>
                    <div className='lengends'>
                    <legend className="mb-3">Personal Information</legend>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Full Name:</label>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                className="form-control"
                                name="fullName"
                                value={studentData.fullName}
                                onChange={handleFieldChange}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Guardian Name:</label>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                className="form-control"
                                name="guardianName"
                                value={studentData.guardianName}
                                onChange={handleFieldChange}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Guardian Tel:</label>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                className="form-control"
                                name="guardianTel"
                                value={studentData.guardianTel}
                                onChange={handleFieldChange}
                            />
                        </div>
                    </div>
                 </div>   
              <div className='lengends'>
                    <legend className="mb-3 mt-4">Academic Information</legend>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">K.C.P.E Index:</label>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                className="form-control"
                                name="kcpeIndex"
                                value={studentData.kcpeIndex}
                                onChange={handleFieldChange}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">K.C.P.E Marks:</label>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                className="form-control"
                                name="kcpeMarks"
                                value={studentData.kcpeMarks}
                                onChange={handleFieldChange}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Former School:</label>
                        <div className="col-sm-10">
                            <input
                                type="text"
                                className="form-control"
                                name="formerSchool"
                                value={studentData.formerSchool}
                                onChange={handleFieldChange}
                            />
                        </div>
                    </div>
                    </div>  
                   <div className='lengends'>
                    <legend className="mb-3 mt-4">Other Information</legend>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Student Birth Date:</label>
                        <div className="col-sm-4">
                            <input
                                type="date"
                                className="form-control"
                                name="studentBirthNo"
                                value={studentData.studentBirthNo}
                                onChange={handleFieldChange}
                            />
                        </div>
                        <label className="col-sm-2 col-form-label">Date of Admission:</label>
                        <div className="col-sm-4">
                            <input
                                type="date"
                                className="form-control"
                                name="dateOfAdmission"
                                value={studentData.dateOfAdmission}
                                onChange={handleFieldChange}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Gender:</label>
                        <div className="col-sm-4">
                            <select
                                className="form-control"
                                name="gender"
                                value={studentData.gender}
                                onChange={handleFieldChange}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <label className="col-sm-2 col-form-label">Boarding or Day:</label>
                        <div className="col-sm-4">
                            <input
                                type="text"
                                className="form-control"
                                name="boardingOrDay"
                                value={studentData.boardingOrDay}
                                onChange={handleFieldChange}
                            />
                        </div>
                    </div>
                    </div>

                    <div className='lengends'>
                    <legend className="mb-3 mt-4">Fees Details</legend> 
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Tuition Fees:</label>
                        <div className="col-sm-4">
                            <input
                                type="text"
                                className="form-control"
                                name="tuitionFees"
                                value={studentData.tuitionFees}
                                onChange={handleFieldChange}
                            />
                        </div>
                        <label className="col-sm-2 col-form-label">Uniform Fees:</label>
                        <div className="col-sm-4">
                            <input
                                type="text"
                                className="form-control"
                                name="uniformFees"
                                value={studentData.uniformFees}
                                onChange={handleFieldChange}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Lunch Fees:</label>
                        <div className="col-sm-4">
                            <input
                                type="text"
                                className="form-control"
                                name="lunchFees"
                                value={studentData.lunchFees}
                                onChange={handleFieldChange}
                            />
                        </div>
                    </div>
                    </div>
                </div>    
                <center><div className="form-buttons">
                        <div className="col-sm-6">
                            <button type="submit" className="btn btn-success btn-block">Update Student</button>
                        </div>
                        <div className="col-sm-6">
                            <button type="button" className="btn btn-danger btn-block" onClick={handleDeleteStudent}>Delete Student</button>
                        </div>
                    </div>
                    </center>  
                </form>
            )}
        </div>
    );
};

export default DeleteStudent;
