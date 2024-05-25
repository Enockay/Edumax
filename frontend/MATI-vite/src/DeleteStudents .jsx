import React, { useState } from 'react';
import axios from 'axios';
import '../css/DeleteStudent.css'; // Import your custom CSS file


const DeleteStudent = () => {
    const [selectedAdmissionNumber, setSelectedAdmissionNumber] = useState('');
    const [studentData, setStudentData] = useState('');
    const [stream , setStream ] = useState('');
    const [classes , setClass ] = useState(['1East','1West','2East','2West','3East','3West','4East','4West'])
    const [error, setError] = useState('');
    const [feedback ,setFeedback ] = useState('');
    const [isLoading ,setIsLoading] = useState(false);


    const fetchStudentData = async (admissionNumber) => {

        const url = `https://edumax.fly.dev/students/${stream}/${admissionNumber}`;
        const uri = `http://localhost:3000/students/${stream}/${admissionNumber}`;

        try {
            setIsLoading(true);
            const response = await axios.get(url);
            console.log(response)
           if(response.data[0]){
              setStudentData(response.data[0]);
           }else{
               setFeedback(response.data);
           }
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
        const url = `https://edumax.fly.dev/students/${stream}/${admissionNumber.admissionNumber}`;
        const uri = `http://localhost:3000/students/${stream}/${admissionNumber.admissionNumber}`;

        setError('');
        try {
           const response =  await axios.put(url, studentData);
            setFeedback(response.data)
        } catch (err) {
            setError('Failed to update student data.');
        }
    };

    const handleDeleteStudent = async () => {
        const url = `https://edumax.fly.dev/students/${stream}/${admissionNumber.admissionNumber}`;
        const uri = `http://localhost:3000/students/${stream}/${admissionNumber.admissionNumber}`;

        if (!studentData) {
            setError('No student selected.');
            return;
        }
        setError('');
        try {
          const response =   await axios.delete(url);
            setSelectedAdmissionNumber('');
            setStudentData(null);
            setFeedback(response.data);
        } catch (err) {
            setError('Failed to delete student data.');
        }
    };

    return (
        <div className="container">
         <center><h2 className="text-center mt-4 mb-4"style={{color:'green',margin:0}}>Update Student Information</h2></center>   
            <div className="form-group-row">
               
                <div className="col-8">
                <label className="col-sm-2 col-form-label">Admission Number:</label>
                    <input
                        type="Number"
                        className="form-control"
                        value={selectedAdmissionNumber}
                        onChange={handleAdmissionNumberChange}
                    />
                </div>    
                <div className="col-8">
                <label className="col-sm-2 col-form-label">Select Stream:</label>
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
                        <div className='spinner-container'>
                             {isLoading ? <span className="spinner"></span> : 
                             <button type="submit" disabled={isLoading} className="btn btn-success btn-block">Update Student</button> || 
                            <button type="button" disabled={isLoading} className="btn btn-danger btn-block" onClick={handleDeleteStudent}>Delete Student</button>
                            }
                        
                       </div> 
                    </div>
                    </center>  
                </form>

            )}
              <div className=''>{feedback}</div>  
        </div>
    );
};

export default DeleteStudent;
