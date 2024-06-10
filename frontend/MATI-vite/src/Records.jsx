import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import '../css/FeesRecords.css';

const FeeReport = () => {
    const [year, setYear] = useState('');
    const [stream, setStream] = useState('');
    const [admissionNumber, setAdmissionNumber] = useState('');
    const [feeRecords, setFeeRecords] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFetchRecords = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://edumax.fly.dev/Records/fetchFeesRecords', {
                params: { year, stream, admissionNumber }
            });

            setFeeRecords(response.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching fee records');
            setFeeRecords(null);
        } finally {
            setLoading(false);
        }
    };

    const generatePDF = async () => {
        try {
            const response = await axios.post('https://edumax.fly.dev/Records/generatePDF', {
                year,
                stream,
                admissionNumber,
                feeRecords
            }, {
                responseType: 'blob' // Ensure response is treated as blob
            });

            // Save the PDF using FileSaver.js
            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
            saveAs(pdfBlob, 'fee_report.pdf');
        } catch (err) {
            console.error('Error generating PDF:', err);
            setError('Error generating PDF');
        }
    };

    return (
        <div className="fee-report-container">
            <h1>Fee Payment Records</h1>
            <div className="form-group">
                <label>
                    Year: 
                    <input 
                        type="text" 
                        value={year} 
                        onChange={(e) => setYear(e.target.value)} 
                    />
                </label>
                <label>
                    Stream: 
                    <select 
                        value={stream} 
                        onChange={(e) => setStream(e.target.value)}
                    >
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
                </label>
                <label>
                    Admission Number: 
                    <input 
                        type="text" 
                        value={admissionNumber} 
                        onChange={(e) => setAdmissionNumber(e.target.value)} 
                    />
                </label>
                <button onClick={handleFetchRecords}>Fetch Records</button>
            </div>
            {error && <p className="error-message">{error}</p>}
            {loading && <div className="spinner"></div>}
            {feeRecords && (
                <div>
                    <center>
                        <button onClick={generatePDF}>Print PDF</button>
                    </center>
                </div>
            )}
        </div>
    );
};

export default FeeReport;
