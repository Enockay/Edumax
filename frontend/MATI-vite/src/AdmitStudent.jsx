import React, { useState } from 'react';
import './AdmitStudent.css';

const AdmitStudent = () => {
    const [formData, setFormData] = useState({
                   fullName: '',
                    guardianName: '',
                    guardianTel : '',
                    admissionNumber: '',
                    stream : '',
                    kcpeIndex: '',
                    kcpeMarks: '',
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
    const [isLoading, setIsLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        let formErrors = {};

        if (formData.fullName.trim().split(' ').length < 3) {
            formErrors.fullName = "Full name must include at least three names.";
        }

        if (!/^\d{10}$/.test(formData.guardianTel)) {
            formErrors.guardianTel = "Phone number must be exactly 10 digits.";
        }

        if (!/^\d{11,}$/.test(formData.kcpeIndex)) {
            formErrors.kcpeIndex = "KCPE Index must be at least 11 digits.";
        }

        return formErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = validateForm();

        if (Object.keys(formErrors).length === 0) {
            setIsLoading(true);
            setResponseMessage('');
            // Replace with your actual API endpoint
            fetch('http://localhost:3000/AdmitStudent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            .then(response => response.json())
            .then(data => {
                setIsLoading(false);
                setResponseMessage(data);
                // Optionally reset the form
                setFormData({
                    fullName: '',
                    guardianName: '',
                    guardianTel : '',
                    admissionNumber: '',
                    stream : '',
                    kcpeIndex: '',
                    kcpeMarks: '',
                    studentBirthNo: '',
                    dateOfAdmission: new Date().toISOString().split('T')[0],
                    gender: '',
                    formerSchool: '',
                    tuitionFees: '',
                    uniformFees: '',
                    lunchFees: '',
                    boardingOrDay: '',
                });
            })
            .catch(error => {
                setIsLoading(false);
                setResponseMessage('Error admitting student. Please try again.');
            });
        } else {
            setErrors(formErrors);
        }
    };

    return (
        <div className="admit-student-container">
            <center><h1 className="form-title">School Admission Form</h1></center>
            <form onSubmit={handleSubmit} >
                <div className="admit-student-form">
                <fieldset>
                    <legend className='lengend'>Personal Information</legend>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            name="fullName" 
                            value={formData.fullName} 
                            onChange={handleChange} 
                            required 
                        />
                        {errors.fullName && <span className="error">{errors.fullName}</span>}
                    </div>
                    <div className="form-group">
                        <label>Guardian Name</label>
                        <input 
                            type="text" 
                            name="guardianName" 
                            value={formData.guardianName} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Guardian Tel</label>
                        <input 
                            type="tel" 
                            name="guardianTel" 
                            value={formData.guardianTel} 
                            onChange={handleChange} 
                            required 
                        />
                        {errors.guardianTel && <span className="error">{errors.guardianTel}</span>}
                    </div>
                    <div className="form-group">
                        <label>Student Birth No</label>
                        <input 
                            type="text" 
                            name="studentBirthNo" 
                            value={formData.studentBirthNo} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Gender</label>
                        <select 
                            name="gender" 
                            value={formData.gender} 
                            onChange={handleChange} 
                            required
                        >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                </fieldset>
                
                <fieldset>
                    <legend className='lengend' >Academic Information</legend>
                    <div className="form-group">
                        <label>Admission Number</label>
                        <input 
                            type="text" 
                            name="admissionNumber" 
                            value={formData.admissionNumber} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Stream</label>
                        <select 
                            name="stream" 
                            value={formData.stream} 
                            onChange={handleChange} 
                            required
                        >
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
                    <div className="form-group">
                        <label>KCPE Index</label>
                        <input 
                            type="text" 
                            name="kcpeIndex" 
                            value={formData.kcpeIndex} 
                            onChange={handleChange} 
                            required 
                        />
                        {errors.kcpeIndex && <span className="error">{errors.kcpeIndex}</span>}
                    </div>
                    <div className="form-group">
                        <label>KCPE Marks</label>
                        <input 
                            type="number" 
                            name="kcpeMarks" 
                            value={formData.kcpeMarks} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Former School</label>
                        <input 
                            type="text" 
                            name="formerSchool" 
                            value={formData.formerSchool} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Date of Admission</label>
                        <input 
                            type="date" 
                            name="dateOfAdmission" 
                            value={formData.dateOfAdmission} 
                            onChange={handleChange} 
                            readOnly 
                        />
                    </div>
                </fieldset>
                
                <fieldset>
                    <legend className='lengend'>Fee Details</legend>
                    <div className="form-group">
                        <label>Tuition Fees</label>
                        <input 
                            type="number" 
                            name="tuitionFees" 
                            value={formData.tuitionFees} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Uniform Fees</label>
                        <input 
                            type="number" 
                            name="uniformFees" 
                            value={formData.uniformFees} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Lunch Fees</label>
                        <input 
                            type="number" 
                            name="lunchFees" 
                            value={formData.lunchFees} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
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
                      <button type="submit" disabled={isLoading}>Admit Students</button>}
                 </div>  
            </form>
            
            {responseMessage && <div className={`response-message ${responseMessage.startsWith('Error') ? 'error' : 'success'}`}>{responseMessage}</div>}
        </div>
    );
};

export default AdmitStudent;
