import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import '../css/FeesReport.css';

const FeesReport = () => {
    const [filters, setFilters] = useState({ stream: '', term: '', date: '' });
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    const fetchReports = async () => {
        setLoading(true);
        setError('');
        setReport([]);
    
        try {
            const params = new URLSearchParams(filters);
            const response = await fetch(`https://edumax.fly.dev/fetchFeesReports?${params}`);
    
            if (!response.ok) {
                // If the response status is not OK, try to read the error message from the response
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error fetching report data.');
            }
    
            // Ensure the response is JSON
            if (response.headers.get('Content-Type')?.includes('application/json')) {
                const data = await response.json();
                console.log(data);
    
                if (Array.isArray(data) && data.length > 0) {
                    const flatReportData = data.flatMap(reportItem =>
                        reportItem.reportData.map(entry => ({
                            ...entry,
                            collector: reportItem.collector,
                            date: reportItem.date
                        }))
                    );
                    setReport(flatReportData);
                } else {
                    setError('No data found.');
                }
            } else {
                throw new Error('Invalid JSON response received.');
            }
        } catch (err) {
            console.error('Error fetching report data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        fetchReports();
    }, [filters]);

    return (
        <div className="fees-report">
            <h2 className="fees-report__title">Fees Reports</h2>
            <center>
            <div style={{fontSize:"0.9rem"}} className="fee-alert fee-red-flag">
                <span className="fee-close" onClick={() => setNotification(null)}>&times;</span>
            <h5 style={{margin:0}}>Can view the fees report that was earlier updated in the system for each student per stream</h5>
            </div>
            </center>  
            <div className="fees-report__filter">
                <div className="fees-report__filter-item">
                    <label>Select Stream:</label>
                    <select name="stream" value={filters.stream} onChange={handleChange}>
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
                <div className="fees-report__filter-item">
                    <label>Select Term:</label>
                    <select name="term" value={filters.term} onChange={handleChange}>
                        <option value="">Select Term</option>
                        <option value="Term 1">Term1</option>
                        <option value="Term 2">Term2</option>
                        <option value="Term 3">Term3</option>
                    </select>
                </div>
                <div className="fees-report__filter-item">
                    <label>Select Day:</label>
                    <input type='date' name="date" value={filters.date} onChange={handleChange}>    
                    </input>
                </div>
            </div>
           <center>{error && <div className="correction-error-message">{error}</div>}</center> 
            {loading ? (
                <center>
                    <ClipLoader color={"#123abc"} loading={loading} size={50} />
                    <p>Loading reports...</p>
                </center>
            ) : (
                report.length > 0 && (
                    <div className="fees-report__table-container">
                        <table className="fees-report__table">
                            <thead>
                                <tr>
                                    <th>Stream</th>
                                    <th>Admission Number</th>
                                    <th>Full Name</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Levi</th>
                                    <th>Fees Paid</th>
                                    <th>Gender</th>
                                    <th>Collector</th> {/* Add Collector column */}
                                </tr>
                            </thead>
                            <tbody>
                                {report.map((entry, index) => (
                                    <tr key={index}>
                                        <td>{entry.stream}</td>
                                        <td>{entry.adm}</td>
                                        <td>{entry.fullName}</td>
                                        <td>{entry.date}</td>
                                        <td>{entry.time}</td>
                                        <td>{entry.levi}</td>
                                        <td>{entry.feesPaid}</td>
                                        <td>{entry.gender}</td>
                                        <td>{entry.collector}</td> {/* Display Collector */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            )}
        </div>
    );
};

export default FeesReport;
