import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/payFees.css';

const PayFees = ({ userRole }) => {
    const [admissionNumber, setAdmissionNumber] = useState('');
    const [stream, setStream] = useState('');
    const [year, setYear] = useState('');
    const [term, setTerm] = useState('');
    const [student, setStudent] = useState(null);
    const [balance, setBalance] = useState({});
    const [levi, setLevi] = useState('');
    const [amountPaid, setAmountPaid] = useState(0);
    const [responseMessage, setResponseMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [updatedInfo, setUpdatedInfo] = useState(null);

    useEffect(() => {
        if (userRole !== 'super-admin') {
            setResponseMessage('Access denied. Only super admin can update fees.');
        }
    }, [userRole]);

    const handleAdmissionNumberChange = (e) => {
        setAdmissionNumber(e.target.value);
    };

    const handleStreamChange = (e) => {
        setStream(e.target.value);
    };

    const handleYearChange = (e) => {
        setYear(e.target.value);
    };

    const handleTermChange = (e) => {
        setTerm(e.target.value);
    };

    const fetchStudentData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/fees/student/${stream}/${admissionNumber}/${year}/${term}`);
            const studentData = response.data;
            console.log(studentData)
            if (studentData) {
                setStudent(studentData);
                setBalance({
                    tuitionFees: studentData.tuitionFees,
                    uniformFees: studentData.uniformFees,
                    lunchFees: studentData.lunchFees,
                });
                setResponseMessage('');
            } else {
                setResponseMessage('No valid student data found.');
                setStudent(null);
                setBalance({});
            }
        } catch (error) {
            console.error('Error fetching student data:', error);
            setResponseMessage('Error fetching student data.');
            setStudent(null);
            setBalance({});
        } finally {
            setLoading(false);
        }
    };

    const handleLeviChange = (e) => {
        setLevi(e.target.value);
    };

    const handleAmountPaidChange = (e) => {
        setAmountPaid(parseFloat(e.target.value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userRole !== 'super-admin') return;

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3000/fees/student/updateFees', {
                stream,
                admissionNumber,
                year,
                term,
                levi,
                amountPaid
            });
            const updatedStudentData = response.data;

            setStudent(updatedStudentData);
            setBalance(updatedStudentData.updatedBalance);
            setUpdatedInfo({
                fullName: updatedStudentData.fullName,
                admissionNumber: updatedStudentData.admissionNumber,
                levi: updatedStudentData.levi,
                updatedBalance: updatedStudentData.updatedBalance,
            });
            setResponseMessage('Successful Fees Update!');
        } catch (error) {
            console.error('Error updating fees:', error);
            setResponseMessage('Error updating fees.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pay-fees-container">
            <center>
                <h3>Update Student Fees</h3>
            </center>
            <div style={{fontSize:"0.9rem"}} className="fee-alert fee-red-flag">
                <span className="fee-close" onClick={() => setNotification(null)}>&times;</span>
           <center>
           You can update fees for even previous terms or even view student balance 
            </center>  
            </div>

            {userRole === 'super-admin' ? (
                <form onSubmit={handleSubmit}>
                    <div className='form-items'>
                    <div className="form-payFees">
                        <label>Stream:</label>
                        <div className="input-payFees">
                            <select value={stream} onChange={handleStreamChange}>
                                <option value="">Select Stream</option>
                                <option value="1East">1East</option>
                                <option value="1West">1West</option>
                                <option value="2East">2East</option>
                                <option value="2West">2West</option>
                                <option value="3East">3East</option>
                                <option value="3West">3West</option>
                                <option value="4East">4East</option>
                                <option value="4West">4West</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-payFees">
                        <label>Admission Number:</label>
                        <div className="input-payFees">
                            <input type="text" value={admissionNumber} onChange={handleAdmissionNumberChange} placeholder='eg 1200'/>
                        </div>
                    </div>
                    <div className='form-payFees'>
                        <label>Year</label>
                        <div className="input-payFees">
                        <input type='number' id='year' value={year} onChange={handleYearChange} placeholder='eg 2024'></input>
                        </div>
                    </div>
                    <div className='form-payFees'>
                        <label>Term</label>
                        <select value={term} onChange={handleTermChange}>
                            <option value="">Select Term</option>
                            <option value="Term 1">Term 1</option>
                            <option value="Term 2">Term 2</option>
                            <option value="Term 3">Term 3</option>
                        </select>
                    </div>
                    </div>
                 <center>
                 <button type="button" onClick={fetchStudentData} disabled={loading}>
                                {loading ? 'Loading...' : 'Show Balance'}
                            </button>
                    </center>   
                    {student && (
                        <div className="pay-fees-d">
                            <div className="student-d">
                                <h3>{student.fullName}</h3>
                                <p>Tuition Fees: Ksh<span className='amount'>{balance.tuitionFees}</span></p>
                                <p>Uniform Fees: Ksh<span className='amount'>{balance.uniformFees}</span></p>
                                <p>Lunch Fees: Ksh<span className='amount'>{balance.lunchFees}</span></p>
                            </div>
                            <div className="payment-d">
                                <div className="form-g">
                                    <label>Select Levi:</label>
                                    <select value={levi} onChange={handleLeviChange}>
                                        <option value="">Select Levi</option>
                                        <option value="tuition">Tuition</option>
                                        <option value="uniform">Uniform</option>
                                        <option value="lunch">Lunch</option>
                                    </select>
                                </div>
                                <div className="form-g">
                                    <label>Amount Paid:</label>
                                    <input type="number" value={amountPaid} onChange={handleAmountPaidChange} placeholder='Ksh 1000..' />
                                </div>
                                <center>
                                    <button type="submit" disabled={loading}>
                                        {loading ? 'Updating...' : 'Update Student Fees'}
                                    </button>
                                </center>
                            </div>
                        </div>
                    )}
                </form>
            ) : (
                <p>{responseMessage}</p>
            )}
            {responseMessage && <div className="response-message">{responseMessage}</div>}
            {updatedInfo && (
                <div className="updated-info">
                    <h4>Updated Fees Information</h4>
                    <p>Full Name: {updatedInfo.fullName}</p>
                    <p>Admission Number: {updatedInfo.admissionNumber}</p>
                    <p>Levi Paid: {updatedInfo.levi}</p>
                    <p>Updated Balances:</p>
                    <p>Tuition Fees: Ksh<span className='amount'>{updatedInfo.updatedBalance.tuitionFees}</span></p>
                    <p>Uniform Fees: Ksh<span className='amount'>{updatedInfo.updatedBalance.uniformFees}</span></p>
                    <p>Lunch Fees: Ksh<span className='amount'>{updatedInfo.updatedBalance.lunchFees}</span></p>
                </div>
            )}
        </div>
    );    
   
};

export default PayFees;
