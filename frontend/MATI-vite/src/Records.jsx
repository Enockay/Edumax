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
    const [loadingMessage, setLoadingMessage] = useState('');

    const handleFetchRecords = async () => {
        setLoading(true);
        setLoadingMessage('Fetching fee records...');
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
        setLoading(true);
        setLoadingMessage('Generating fee statement...');
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
            setError('');
        } catch (err) {
            console.error('Error generating PDF:', err);
            setError('Error generating PDF');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fee-report-container">
            <h1>Fee Payment Statement</h1>
            <div className="green-flag">
                <p>This component allows you to fetch and view fee payment records for a specific student. Enter the year, stream, and admission number, then click "Fetch Records". Once the records are fetched, you can generate a PDF of the fee statement by clicking "Print PDF".</p>
            </div>
            <div className="Records-form-group">
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
            </div>
            <div className="button-container">
                <button onClick={handleFetchRecords}>Fetch Records</button>
            </div>
            {error && <p className="error-message">{error}</p>}
            {loading && (
                <div className="spinner-container">
                    <div className="spinner"></div>
                    <p>{loadingMessage}</p>
                </div>
            )}
            {feeRecords && (
                <div className="button-container">
                    <button onClick={generatePDF}>Print PDF</button>
                </div>
            )}
        </div>
    );
};

export default FeeReport;
