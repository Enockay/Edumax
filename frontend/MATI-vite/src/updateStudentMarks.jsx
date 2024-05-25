import React, { useState } from 'react';
import axios from 'axios';
import '../css/updateStudentMarks.css';

const TeacherMarksForm = () => {
    const [streams, setStreams] = useState(['4East', '4West', '3East', '3West', '2East', '2West', '1East', '1West']);
    const [units, setUnits] = useState(['Eng', 'Kisw', 'Maths', 'Chem', 'Bio', 'Phy', 'Agri', 'Busn', 'Hist', 'Geo', 'Cre']);
    const [selectedStream, setSelectedStream] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [students, setStudents] = useState([]);
    const [notification, setNotification] = useState('');
    const [marks, setMarks] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [update, setUpdate] = useState('');

    const fetchClassList = () => {
        setIsLoading(true);
        axios.get('http://localhost:3000/students', { params: { stream: selectedStream, unit: selectedUnit } })
            .then(response => {
                setIsLoading(false);
                if (response.data.length === 0) {
                    setNotification(`No data found for ${selectedStream} unit ${selectedUnit}`);
                    setStudents('');
                } else {
                    // Sort students by admission number (assuming it's numeric)
                    const sortedStudents = response.data.sort((a, b) => a.studentAdmission - b.studentAdmission);
                    setStudents(sortedStudents);
                    setNotification('')
                }
            })
            .catch(error => {
                console.error('Error fetching students:', error);
                setIsLoading(false);
            });
    };

    const handleMarkChange = (studentId, paper, value) => {
        setMarks({
            ...marks,
            [studentId]: {
                ...marks[studentId],
                [paper]: value
            }
        });
    };

    const handleSubmit = () => {
        students.forEach(student => {
            setIsLoadingUpdate(true);
            const studentMarks = marks[student._id];
            if (studentMarks) {
                axios.put(`http://localhost:3000/students/${student._id}/marks`, {
                    unit: selectedUnit,
                    marks: studentMarks
                })
                    .then(response => {
                        setIsLoadingUpdate(false);
                        setUpdate(response.data);
                        console.log('Marks updated:', response.data);
                    })
                    .catch(error => {
                        console.error('Error updating marks:', error);
                    });
            }
        });
    };

    const renderPaperFields = (student) => {
        if (['3East', '3West', '4East', '4West'].includes(selectedStream)) {
            if (['Chem', 'Bio', 'Phy', 'Eng', 'Kisw'].includes(selectedUnit)) {
                return (
                    <>
                        <td>
                            <input
                                className='input'
                                type="number"
                                value={marks[student._id]?.P1 || ''}
                                onChange={(e) => handleMarkChange(student._id, 'P1', e.target.value)}
                            />
                        </td>
                        <td>
                            <input
                                className='input'
                                type="number"
                                value={marks[student._id]?.P2 || ''}
                                onChange={(e) => handleMarkChange(student._id, 'P2', e.target.value)}
                            />
                        </td>
                        <td>
                            <input
                                className='input'
                                type="number"
                                value={marks[student._id]?.P3 || ''}
                                onChange={(e) => handleMarkChange(student._id, 'P3', e.target.value)}
                            />
                        </td>
                    </>
                );
            } else {
                return (
                    <>
                        <td>
                            <input
                                className='input'
                                type="number"
                                value={marks[student._id]?.P1 || ''}
                                onChange={(e) => handleMarkChange(student._id, 'P1', e.target.value)}
                            />
                        </td>
                        <td>
                            <input
                                className='input'
                                type="number"
                                value={marks[student._id]?.P2 || ''}
                                onChange={(e) => handleMarkChange(student._id, 'P2', e.target.value)}
                            />
                        </td>
                    </>
                );
            }
        } else if (['2East', '2West', '1East', '1West'].includes(selectedStream)) {
            return (
                <td>
                    <input
                        className='input'
                        type="number"
                        value={marks[student._id]?.P1 || ''}
                        onChange={(e) => handleMarkChange(student._id, 'P1', e.target.value)}
                    />
                </td>
            );
        }
        return null;
    };

    const renderTableHeaders = () => {
        if (['3East', '3West', '4East', '4West'].includes(selectedStream)) {
            if (['Chem', 'Bio', 'Phy', 'Eng', 'Kisw'].includes(selectedUnit)) {
                return (
                    <>
                        <th className='th'>P1</th>
                        <th className='th'>P2</th>
                        <th className='th'>P3</th>
                    </>
                );
            } else {
                return (
                    <>
                        <th className='th'>P1</th>
                        <th className='th'>P2</th>
                    </>
                );
            }
        } else if (['2East', '2West', '1East', '1West'].includes(selectedStream)) {
            return <th className='th'>P1</th>;
        }
        return null;
    };

    return (
        <div className="container">
            <h2 style={{ color: 'blue' }}>Update Student Marks</h2>
            <div className="form-group">
                <label>Select Stream:</label>
                <select value={selectedStream} onChange={(e) => setSelectedStream(e.target.value)}>
                    <option value="">--Select Stream--</option>
                    {streams.map(stream => (
                        <option key={stream} value={stream}>{stream}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Select Unit:</label>
                <select value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)}>
                    <option value="">--Select Unit--</option>
                    {units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                    ))}
                </select>
                <div className='spinner-container'>
                    {isLoading ? <span className="spinner"></span> :
                        <button onClick={fetchClassList} disabled={isLoading}>Fetch Class List</button>}
                </div>
                <center>{notification}</center>
            </div>
            {students.length > 0 && (
                <div>
                <center><h3>Students in {selectedStream} unit {selectedUnit}</h3></center>    
                    <table>
                        <thead>
                            <tr>
                                <th className='th'>Admission</th>
                                <th className='th'>Name</th>
                                {renderTableHeaders()}
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student._id}>
                                    <td>{student.studentAdmission}</td>
                                    <td>{student.studentName}</td>
                                    {renderPaperFields(student)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='spinner-container'>
                        {isLoadingUpdate ? <span className="spinner"></span> :
                            <button onClick={handleSubmit} className='Update-Marks' disabled={isLoadingUpdate}>Update Marks</button>}
                    </div>
                    <center>{update}</center>
                </div>
            )}
        </div>
    );
};

export default TeacherMarksForm;
