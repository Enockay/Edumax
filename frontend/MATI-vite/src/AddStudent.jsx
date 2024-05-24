import React, { useState } from 'react';
import './index.css';

const AddStudent = () => {
    const [formData, setFormData] = useState({
                    fullName: '',
                    guardianName: '',
                    guardianTel : '',
                    admissionNumber: '',
                    stream : '',
                    kcpeIndex: '',
                    kcpeMarks: '',
                    guardianTel: '',
                    studentBirthNo: '',
                    dateOfAdmission: new Date().toISOString().split('T')[0],
                    gender: '',
                    formerSchool: '',
                    tuitionFees: '',
                    uniformFees: '',
                    lunchFees: '',
                    boardingOrDay: '',
    });

    const [errors, setErrors] = useState({});
    const [success ,setSuccess ] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const validate = () => {
        let errors = {};
        if (formData.fullName.length < 3) errors.fullName = "Full name must be at least 3 characters long";
        if (formData.kcpeIndex.length < 11) errors.kcpeIndex = "KCPE Index must be at least 11 characters long";
        if (formData.guardianTel.length < 10) errors.guardianTel = "Guardian phone number must be at least 10 characters long";
        // Add more validations as needed
        return errors;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            // Send formData to backend API
            setIsLoading(true);
            fetch('http://localhost:3000/AdmitStudent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                setIsLoading(false);
                console.log('Success:', data);
                setSuccess(data)
            })
            .catch((error) => {
                console.error('Error:', error);
                setErrors(error);
            });
        }
    };

    return (
        <div className="form-container">
            <h2 style={{color : 'green',margin:0,marginBottom : '1rem'}}>Add Continuing Student</h2>
            <form className="" onSubmit={handleSubmit}>
                <div className='add-student-form'>
                <fieldset>
                    <legend>Personal Information</legend>
                    <div>
                        <label>Full Name:</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
                        {errors.fullName && <p className="error">{errors.fullName}</p>}
                    </div>
                    <div>
                        <label>Guardian Name:</label>
                        <input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Guardian Tel:</label>
                        <input type="text" name="guardianTel" value={formData.guardianTel} onChange={handleChange} />
                        {errors.guardianTel && <p className="error">{errors.guardianTel}</p>}
                    </div>
                    <div>
                        <label>Student Birth Date:</label>
                        <input type="date" name="studentBirthNo" value={formData.studentBirthNo} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Gender:</label>
                        <select name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Academic Information</legend>
                    <div>
                        <label>Admission Number:</label>
                        <input type="text" name="admissionNumber" value={formData.admissionNumber} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Stream : </label>
                        <select name="stream" value={formData.stream} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="1East">1 East</option>
                            <option value="1West">1 West</option>
                            <option value="2East">2 East</option>
                            <option value="2West">2 West</option>
                            <option value="3East">3 East</option>
                            <option value="3West">3 West</option>
                            <option value="4East">4 East</option>
                            <option value="4West">4 West</option>
                        </select>
                    </div>
                    <div>
                        <label>KCPE Index:</label>
                        <input type="text" name="kcpeIndex" value={formData.kcpeIndex} onChange={handleChange} />
                        {errors.kcpeIndex && <p className="error">{errors.kcpeIndex}</p>}
                    </div>
                    <div>
                        <label>KCPE Marks:</label>
                        <input type="text" name="kcpeMarks" value={formData.kcpeMarks} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Former School:</label>
                        <input type="text" name="formerSchool" value={formData.formerSchool} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Date of Admission:</label>
                        <input type="date" name="dateOfAdmission" value={formData.dateOfAdmission} onChange={handleChange} />
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Fee Details</legend>
                    <div>
                        <label>Tuition Fees:</label>
                        <input type="text" name="tuitionFees" value={formData.tuitionFees} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Uniform Fees:</label>
                        <input type="text" name="uniformFees" value={formData.uniformFees} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Lunch Fees:</label>
                        <input type="text" name="lunchFees" value={formData.lunchFees} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Boarding or Day</label>
                        <select 
                            name="boardingOrDay" 
                            value={formData.boardingOrDay} 
                            onChange={handleChange} 
                            required
                        >
                            <option value="">Select</option>
                            <option value="boarding">Boarding</option>
                            <option value="day">Day</option>
                        </select>
                    </div>
                </fieldset>
                </div>
                <div className='spinner-container'>
                    {isLoading ? <span className="spinner"></span> : 
                      <button type="submit" disabled={isLoading}>Add Student</button>}
                 </div>  
            </form>
            <center><div className=''style={{color: 'green'}}>{success}</div></center>
        </div>
    );
};

export default AddStudent;