import React, { useState } from 'react';
import axios from 'axios';
import '../css/index.css';

const FeesForm = () => {
    const [allStudentsFormData, setAllStudentsFormData] = useState({
        year: '',
        term :'',
        tuition: '',
        lunch: ''
    });

    const [singleStudentFormData, setSingleStudentFormData] = useState({
        admissionNumber: '',
        name: '',
        stream: '',
        year: '',
        term: '',
        tuition: '',
        uniform: '',
        lunch: ''
    });

    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    const handleAllStudentsChange = (e) => {
        setAllStudentsFormData({ ...allStudentsFormData, [e.target.name]: e.target.value });
    };

    const handleSingleStudentChange = (e) => {
        setSingleStudentFormData({ ...singleStudentFormData, [e.target.name]: e.target.value });
    };

    const handleAllStudentsSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setNotification(null);

        try {
            const response = await axios.post('https://edumax.fly.dev/fees/setTotalFees', allStudentsFormData);
            setLoading(false);
            setNotification({ type: 'success', message: response.data.message });
        } catch (error) {
            setLoading(false);
            setNotification({ type: 'error', message: error.response?.data?.message || 'Server error' });
        }
    };

    const handleSingleStudentSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setNotification(null);

        try {
            const response = await axios.post('https://edumax.fly.dev/fees/students/admit', singleStudentFormData);
            setLoading(false);
            setNotification({ type: 'success', message: response.data.message });
            setSingleStudentFormData("")
        } catch (error) {
            setLoading(false);
            setNotification({ type: 'error', message: error.response?.data?.message || 'Server error' });
        }
    };

    const fetchStudentDetails = async () => {
        setLoading(true);
        setNotification(null);

        try {
            const response = await fetch(`https://edumax.fly.dev/fees/students/${singleStudentFormData.admissionNumber}`);
            setLoading(false);
            const data = await response.json();
            const student = data;
            console.log(student.fullName)
            setSingleStudentFormData({
                ...singleStudentFormData,
                name: student.fullName,
                stream: student.stream,
                term: '',
                tuition: '',
                uniform: '',
                lunch: ''
            });
        } catch (error) {
            setLoading(false);
            setNotification({ type: 'error', message: error.response?.data?.message || 'Student not found' });
        }
    };

    return (
        <div className="fee-fullscreen-container">
            <header className="fee-header">
                <h1 className="fee-title">School Finance Remittance</h1>
            </header>

            <div className="fee-alert fee-red-flag">
                <span className="fee-close" onClick={() => setNotification(null)}>&times;</span>
              Please Note At the start of every new term students must be either automatically update there fees for that term still new student must be admitted to finance 
            </div>

            <div className="fee-form-container">
                <div className='fee-form-items'>
                <form onSubmit={handleAllStudentsSubmit} className="fee-form">
                    <center>
                    <h4>Automatic Admit All Students To Finance</h4>
                    </center>
                    <div className="fee-form-group">
                        <label htmlFor="year" className="fee-label">Year</label>
                        <input
                            type="text"
                            id="year"
                            name="year"
                            value={allStudentsFormData.year}
                            onChange={handleAllStudentsChange}
                            className="fee-input"
                            required
                        />
                    </div>
                    <div className="fee-form-group">
                        <label htmlFor="stream" className="fee-label">Term</label>
                        <select
                            id="stream"
                            name="Term"
                            value={allStudentsFormData.stream}
                            onChange={handleAllStudentsChange}
                            className="fee-input"
                            required
                        >
                            <option value="">Select Term</option>
                            <option value="Term 1">Term 1</option>
                            <option value="Term 2">Term 2</option>
                            <option value="Term 3">Term 3</option>
                        </select>
                    </div>
                    <div className="fee-form-group">
                        <label htmlFor="tuition" className="fee-label">Tuition</label>
                        <input
                            type="number"
                            id="tuition"
                            name="tuition"
                            value={allStudentsFormData.tuition}
                            onChange={handleAllStudentsChange}
                            className="fee-input"
                            required
                        />
                    </div>
                    <div className="fee-form-group">
                        <label htmlFor="lunch" className="fee-label">Lunch</label>
                        <input
                            type="number"
                            id="lunch"
                            name="lunch"
                            value={allStudentsFormData.lunch}
                            onChange={handleAllStudentsChange}
                            className="fee-input"
                            required
                        />
                    </div>
                    <div className="fee-form-group">
                        <button type="submit" className="fee-button" disabled={loading}>
                            {loading ? 'Setting Fees...' : 'Set Fees'}
                        </button>
                    </div>
                </form>

                <form onSubmit={handleSingleStudentSubmit} className="fee-form">
                  <center>
                     <h4>Admit New Student To Finance</h4>
                    </center>  
                    <div className="fee-form-group-in">
                        <label htmlFor="admissionNumber" className="fee-label">Admission Number</label>
                        <input
                            type="text"
                            id="admissionNumber"
                            name="admissionNumber"
                            value={singleStudentFormData.admissionNumber}
                            onChange={handleSingleStudentChange}
                            className="fee-input"
                            required
                        />
                        <button type="button" className="fee-button fee-fetch-button" onClick={fetchStudentDetails} disabled={loading}>
                            {loading ? 'Fetching...' : 'Fetch Student'}
                        </button>
                    </div>
                    {singleStudentFormData.name && (
                        <>
                        
                             <center>
                               <h4>Name: {singleStudentFormData.name}.</h4>
                               <h4 style={{marginBottom:0}}>Stream : {singleStudentFormData.stream}.</h4>
                             </center>
                          
                            <div className="fee-form-group">
                                <label htmlFor="year" className="fee-label">Year</label>
                                <input
                                    type="text"
                                    id="year"
                                    name="year"
                                    value={singleStudentFormData.year}
                                    onChange={handleSingleStudentChange}
                                    className="fee-input"
                                    required
                                />
                            </div>
                            <div className="fee-form-group">
                        <label htmlFor="stream" className="fee-label">Term</label>
                        <select
                            id="stream"
                            name="term"
                            value={allStudentsFormData.stream}
                            onChange={handleSingleStudentChange}
                            className="fee-input"
                            required
                        >
                            <option value="">Select Term</option>
                            <option value="Term 1">Term 1</option>
                            <option value="Term 2">Term 2</option>
                            <option value="Term 3">Term 3</option>
                        </select>
                    </div>
                            <div className="fee-form-group">
                                <label htmlFor="tuition" className="fee-label">Tuition</label>
                                <input
                                    type="number"
                                    id="tuition"
                                    name="tuition"
                                    value={singleStudentFormData.tuition}
                                    onChange={handleSingleStudentChange}
                                    className="fee-input"
                                    required
                                />
                            </div>
                            <div className="fee-form-group">
                                <label htmlFor="uniform" className="fee-label">Uniform</label>
                                <input
                                    type="number"
                                    id="uniform"
                                    name="uniform"
                                    value={singleStudentFormData.uniform}
                                    onChange={handleSingleStudentChange}
                                    className="fee-input"
                                    required
                                />
                            </div>
                            <div className="fee-form-group">
                                <label htmlFor="lunch" className="fee-label">Lunch</label>
                                <input
                                    type="number"
                                    id="lunch"
                                    name="lunch"
                                    value={singleStudentFormData.lunch}
                                    onChange={handleSingleStudentChange}
                                    className="fee-input"
                                    required
                                />
                            </div>
                            <div className="fee-form-group">
                                <button type="submit" className="fee-button" disabled={loading}>
                                    {loading ? 'Setting Fees...' : 'Set Fees'}
                                </button>
                            </div>
                        </>
                    )}
                </form>
                </div>  
            </div>

            {loading && (
                <div className="fee-spinner">
                    <div className="fee-double-bounce1"></div>
                    <div className="fee-double-bounce2"></div>
                </div>
            )}
             {notification && (
                <div className={`fee-alert ${notification.type === 'error' ? 'fee-alert-error' : 'fee-alert-success'}`}>
                    <span className="fee-close" onClick={() => setNotification(null)}>&times;</span>
                   <center>
                   {notification.message}
                    </center> 
                </div>
            )}
        </div>
    );
};

export default FeesForm;
