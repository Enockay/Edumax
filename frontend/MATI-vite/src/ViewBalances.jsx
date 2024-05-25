import React, { useState } from 'react';
import '../css/index.css';

const ViewBalances = () => {
    const [stream, setStream] = useState('');
    const [feeType, setFeeType] = useState('');
    const [criteria, setCriteria] = useState('');
    const [amount, setAmount] = useState('');
    const [students, setStudents] = useState([]);
    const [errors, setErrors] = useState({});

    const handleStreamChange = (e) => setStream(e.target.value);
    const handleFeeTypeChange = (e) => setFeeType(e.target.value);
    const handleCriteriaChange = (e) => setCriteria(e.target.value);
    const handleAmountChange = (e) => setAmount(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate fields
        const newErrors = {};
        if (!stream) newErrors.stream = 'Stream is required';
        if (!feeType) newErrors.feeType = 'Fee type is required';
        if (!criteria) newErrors.criteria = 'Criteria is required';
        if (!amount) newErrors.amount = 'Amount is required';
        
        setErrors(newErrors);

        // If there are no errors, show dummy data
        if (Object.keys(newErrors).length === 0) {
            // Dummy data
            const dummyData = [
                { adm: '123', fullName: 'John Doe', gender: 'Male', feeBalance: 1500 },
                { adm: '124', fullName: 'Jane Smith', gender: 'Female', feeBalance: 500 },
                { adm: '125', fullName: 'Alice Johnson', gender: 'Female', feeBalance: 1000 }
            ];

            // Filtering the dummy data based on criteria
            let filteredStudents = dummyData;
            if (criteria === 'greater') {
                filteredStudents = dummyData.filter(student => student.feeBalance > Number(amount));
            } else if (criteria === 'less') {
                filteredStudents = dummyData.filter(student => student.feeBalance < Number(amount));
            } else if (criteria === 'equal') {
                filteredStudents = dummyData.filter(student => student.feeBalance === Number(amount));
            }

            setStudents(filteredStudents);
        }
    };

    return (
        <div className="view-balances-container">
            <h1>Bulk Student Balancies</h1>
            <form onSubmit={handleSubmit} className="view-balances-form">
                <div>
                    <label>Stream:</label>
                    <select value={stream} onChange={handleStreamChange}>
                        <option value="">Select Stream</option>
                        <option value="Form 4 East">Form 4 East</option>
                        <option value="Form 4 West">Form 4 West</option>
                        <option value="Form 3 East">Form 3 East</option>
                        <option value="Form 3 West">Form 3 West</option>
                        <option value="Form 2 East">Form 2 East</option>
                        <option value="Form 2 West">Form 2 West</option>
                        <option value="Form 1 East">Form 1 East</option>
                        <option value="Form 1 West">Form 1 West</option>
                    </select>
                    {errors.stream && <div className="error">{errors.stream}</div>}
                </div>
                <div>
                    <label>Fee Type:</label>
                    <select value={feeType} onChange={handleFeeTypeChange}>
                        <option value="">Select Fee Type</option>
                        <option value="Tuition">Tuition</option>
                        <option value="Lunch">Lunch</option>
                    </select>
                    {errors.feeType && <div className="error">{errors.feeType}</div>}
                </div>
                <div>
                    <label>Criteria:</label>
                    <select value={criteria} onChange={handleCriteriaChange}>
                        <option value="">Select Criteria</option>
                        <option value="greater">Greater than</option>
                        <option value="less">Less than</option>
                        <option value="equal">Equal to</option>
                    </select>
                    {errors.criteria && <div className="error">{errors.criteria}</div>}
                </div>
                <div>
                    <label>Amount:</label>
                    <input type="number" value={amount} onChange={handleAmountChange} />
                    {errors.amount && <div className="error">{errors.amount}</div>}
                </div>
                <button type="submit">Search</button>
            </form>

            {students.length > 0 && (
                <table className="students-table">
                    <thead>
                        <tr>
                            <th>Admission Number</th>
                            <th>Full Name</th>
                            <th>Gender</th>
                            <th>Fee Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.adm}>
                                <td>{student.adm}</td>
                                <td>{student.fullName}</td>
                                <td>{student.gender}</td>
                                <td>{student.feeBalance}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ViewBalances;
