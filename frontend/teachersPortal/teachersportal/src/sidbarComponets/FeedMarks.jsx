import React, { useState } from 'react';
import axios from 'axios';
import './css/FeedMarks.css';

const FeedMarks = () => {
    const [streams] = useState(['4East', '4West', '3East', '3West', '2East', '2West', '1East', '1West']);
    const [units] = useState(['Eng', 'Kisw', 'Maths', 'Chem', 'Bio', 'Phy', 'Agri', 'Busn', 'Hist', 'Geo', 'Cre']);
    const [terms] = useState(['Term 1', 'Term 2', 'Term 3']);
    const [examTypes] = useState(['CAT', 'Midterm', 'Endterm', 'TestExam']);
    const [years] = useState(['2024', '2023', '2022', '2021']);
    const [selectedStream, setSelectedStream] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [selectedTerm, setSelectedTerm] = useState('');
    const [selectedExamType, setSelectedExamType] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [students, setStudents] = useState([]);
    const [notification, setNotification] = useState('');
    const [marks, setMarks] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [update, setUpdate] = useState('');

    const fetchClassList = () => {
        const url = 'http://localhost:3000/students';
        const uri = 'https://edumax.fly.dev/students';

        setIsLoading(true);
        setUpdate('')
        axios.get(uri, {
            params: {
                stream: selectedStream
            }
        })
            .then(response => {
                setIsLoading(false);
                if (response.data.length === 0) {
                    setNotification(`No data found for ${selectedStream}`);
                    setStudents([]);
                } else {
                    const sortedStudents = response.data.sort((a, b) => a.studentAdmission - b.studentAdmission);
                    setStudents(sortedStudents);
                    setNotification('');
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
                const uri = `http://localhost:3000/students/${student._id}/marks`;
                const url = `https://edumax.fly.dev/students/${student._id}/marks`;

                axios.put(url, {
                    unit: selectedUnit,
                    term: selectedTerm,
                    examType: selectedExamType,
                    year: selectedYear,
                    marks: studentMarks
                })
                    .then(response => {
                        setIsLoadingUpdate(false);
                        setUpdate(response.data);
                        console.log('Marks updated:', response.data);
                        setStudents([])
                    })
                    .catch(error => {
                        console.error('Error updating marks:', error);
                        setIsLoadingUpdate(false);
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
                                className='input input-p1'
                                type="number"
                                value={marks[student._id]?.P1 || ''}
                                onChange={(e) => handleMarkChange(student._id, 'P1', e.target.value)}
                            />
                        </td>
                        <td>
                            <input
                                className='input input-p2'
                                type="number"
                                value={marks[student._id]?.P2 || ''}
                                onChange={(e) => handleMarkChange(student._id, 'P2', e.target.value)}
                            />
                        </td>
                        <td>
                            <input
                                className='input input-p3'
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
                                className='input input-p1'
                                type="number"
                                value={marks[student._id]?.P1 || ''}
                                onChange={(e) => handleMarkChange(student._id, 'P1', e.target.value)}
                            />
                        </td>
                        <td>
                            <input
                                className='input input-p2'
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
                        className='input input-p1'
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
                        <th className='th th-p1'>P1</th>
                        <th className='th th-p2'>P2</th>
                        <th className='th th-p3'>P3</th>
                    </>
                );
            } else {
                return (
                    <>
                        <th className='th th-p1'>P1</th>
                        <th className='th th-p2'>P2</th>
                    </>
                );
            }
        } else if (['2East', '2West', '1East', '1West'].includes(selectedStream)) {
            return <th className='th th-p1'>P1</th>;
        }
        return null;
    };

    return (
        <div className="container">
            <h2 className="title">Update Student Marks</h2>
            <div className="stream-selection">
                <div className="form-group stream-group">
                    <label className="label-stream">Select Stream:</label>
                    <select className="select-stream" value={selectedStream} onChange={(e) => setSelectedStream(e.target.value)}>
                        <option value="">--Select Stream--</option>
                        {streams.map(stream => (
                            <option key={stream} value={stream}>{stream}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group unit-group">
                    <label className="label-unit">Select Unit:</label>
                    <select className="select-unit" value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)}>
                        <option value="">--Select Unit--</option>
                        {units.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group year-group">
                    <label className="label-year">Select Year:</label>
                    <select className="select-year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                        <option value="">--Select Year--</option>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <div className="spinner-container">
                    <center> {isLoading ? <span className="spinner"></span> :
                        <button className="fetch-button" onClick={fetchClassList} disabled={isLoading || !selectedStream || !selectedUnit}>Fetch Class List</button>}
                    </center>
                </div>
            </div>
            <center className="notification">{notification}</center>

            {students.length > 0 && (
                <>
                    <div className="details-selection">

                        <div className="form-group term-group">
                            <label className="label-term">Select Term:</label>
                            <select className="select-term" value={selectedTerm} required onChange={(e) => setSelectedTerm(e.target.value)}>
                                <option value="">--Select Term--</option>
                                {terms.map(term => (
                                    <option key={term} value={term}>{term}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group exam-group">
                            <label className="label-exam">Select Exam Type:</label>
                            <select className="select-exam" value={selectedExamType} required onChange={(e) => setSelectedExamType(e.target.value)}>
                                <option value="">--Select Exam Type--</option>
                                {examTypes.map(examType => (
                                    <option key={examType} value={examType}>{examType}</option>
                                ))}
                            </select>
                        </div>


                        <div className="students-table">
                            <center><h3 className="table-title">Students in {selectedStream} - {selectedUnit}</h3></center>
                            <table className="marks-table">
                                <thead>
                                    <tr>
                                        <th className='th th-admission'>Admission</th>
                                        <th className='th th-name'>Name</th>
                                        {renderTableHeaders()}
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map(student => (
                                        <tr key={student._id}>
                                            <td className="td-admission">{student.studentAdmission}</td>
                                            <td className="td-name">{student.studentName}</td>
                                            {renderPaperFields(student)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className='spinner-container'>
                                {isLoadingUpdate ? <span className="spinner" style={{fontSize:"2rem"}}></span> :
                                    <button onClick={handleSubmit} className='update-button' disabled={isLoadingUpdate||!selectedExamType||!selectedTerm}>Update Marks</button>}
                            </div>
                          
                        </div>
                    </div>
                </>
            )}
              <center className="update-notification">{update}</center>
        </div>

    );
};

export default FeedMarks;
