import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import '../css/CorrectionSheet.css';

const CorrectionSheet = () => {
    const [year, setYear] = useState('');
    const [term, setTerm] = useState('');
    const [stream, setStream] = useState('');
    const [examType, setExamType] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const termExam = ['Term 1', 'Term 2', 'Term 3'];
    const examTypes = ['CAT', 'Midterm', 'Endterm', 'TestExam'];

    const handleGeneratePDF = async () => {
        if(!stream || !examType||!term || !year){
            return setError("All fields required")
        }
        setLoading(true);
        try {
            const response = await axios.post('https://edumax.fly.dev/CorrectionSheet', {
                year,
                term,
                stream,
                examType
            }, {
                responseType: 'blob'
            });

            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
            saveAs(pdfBlob, 'correction_sheet.pdf');
            setError('');
        } catch (err) {
            setError('Error generating PDF');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="correction-sheet-container">
            <h1 className="correction-header">Generate Correction Sheet</h1>
            <div className="correction-header-flag">Please fill in the details below to generate the correction sheet for the entire class.</div>
            <div className="correction-form-group">
                <label className="correction-label">
                    Year: 
                    <input 
                        type="text" 
                        className="correction-input"
                        value={year} 
                        onChange={(e) => setYear(e.target.value)} 
                    />
                </label>
                <label className="correction-label">
                    Term: 
                    <select 
                        className="correction-select"
                        value={term} 
                        onChange={(e) => setTerm(e.target.value)}
                    >
                        <option value="">Select Term</option>
                        {termExam.map(term => (
                            <option key={term} value={term}>{term}</option>
                        ))}
                    </select>
                </label>
                <label className="correction-label">
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
                <label className="correction-label">
                    Exam Type: 
                    <select 
                        className="correction-select"
                        value={examType} 
                        onChange={(e) => setExamType(e.target.value)}
                    >
                        <option value="">Select Exam Type</option>
                        {examTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="correction-button-container">
            <center>
            <button 
                    className="correction-button" 
                    onClick={handleGeneratePDF} 
                    disabled={loading}
                >
                    {loading ? 'Generating...' : 'Generate Correction Sheet'}
                </button>
                </center>   
            </div>
            {error && <p className="correction-error-message">{error}</p>}
        </div>
    );
};

export default CorrectionSheet;
