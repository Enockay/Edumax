import React, { useState } from 'react';
import './ShowStream.css';

const ShowStream = () => {
    const [selectedForm, setSelectedForm] = useState('');
    const [selectedStream, setSelectedStream] = useState('');
    const [aggregateBalance, setAggregateBalance] = useState(null);
    const [error, setError] = useState('');

    const handleFormChange = (e) => {
        setSelectedForm(e.target.value);
    };

    const handleStreamChange = (e) => {
        setSelectedStream(e.target.value);
    };

    const handleSearch = () => {
        if (!selectedForm || !selectedStream) {
            setError('Please select both form and stream.');
            return;
        }

        setError('');

        // Dummy data for demonstration
        const dummyData = [
            { form: 'Form 4', stream: 'East', balance: 5000 },
            { form: 'Form 4', stream: 'West', balance: 6000 },
            { form: 'Form 3', stream: 'East', balance: 4000 },
            { form: 'Form 3', stream: 'West', balance: 4500 },
            { form: 'Form 2', stream: 'East', balance: 3000 },
            { form: 'Form 2', stream: 'West', balance: 3500 },
            { form: 'Form 1', stream: 'East', balance: 2000 },
            { form: 'Form 1', stream: 'West', balance: 2500 },
        ];

        const filteredData = dummyData.filter(data => data.form === selectedForm && data.stream === selectedStream);
        
        if (filteredData.length > 0) {
            setAggregateBalance(filteredData.reduce((acc, curr) => acc + curr.balance, 0));
        } else {
            setAggregateBalance(0);
        }
    };

    return (
        <div className="show-stream-container">
            <h2>Show Stream Fee Balance</h2>
            <div className="search-form">
                <div className="form-group">
                    <label>Select Form:</label>
                    <select value={selectedForm} onChange={handleFormChange}>
                        <option value="">Select Form</option>
                        <option value="Form 4">Form 4</option>
                        <option value="Form 3">Form 3</option>
                        <option value="Form 2">Form 2</option>
                        <option value="Form 1">Form 1</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Select Stream:</label>
                    <select value={selectedStream} onChange={handleStreamChange}>
                        <option value="">Select Stream</option>
                        <option value="East">East</option>
                        <option value="West">West</option>
                    </select>
                </div>
                <button type="button" onClick={handleSearch}>Show Balance</button>
            </div>
            {error && <div className="error-message">{error}</div>}
            {aggregateBalance !== null && (
                <div className="aggregate-balance">
                    <h3>Aggregate Fee Balance</h3>
                    <p>Total Balance for {selectedForm} - {selectedStream}: ${aggregateBalance}</p>
                </div>
            )}
        </div>
    );
};

export default ShowStream;

