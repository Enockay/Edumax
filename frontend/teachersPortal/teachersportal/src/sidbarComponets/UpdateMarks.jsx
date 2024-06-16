import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/UpdMarks.css';
import { jwtDecode } from 'jwt-decode';

const UpdateStudentMarks = () => {
    const [streams, setStreams] = useState([]);
    const [units, setUnits] = useState([]);
    const [terms] = useState(['Term 1', 'Term 2', 'Term 3']);
    const [examTypes] = useState(['CAT', 'Midterm', 'Endterm', 'TestExam']);
    const [years] = useState(['2024', '2023', '2022', '2021']);
    const [selectedStream, setSelectedStream] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [selectedTerm, setSelectedTerm] = useState('');
    const [selectedExamType, setSelectedExamType] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState({});
    const [notification, setNotification] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [updateMessage, setUpdateMessage] = useState('');
    const [empty, setEmpty] = useState('');

    const subjectMapping = {
        'Eng': 'English',
        'Kisw': 'Kiswahili',
        'Maths': 'Mathematics',
        'Chem': 'Chemistry',
        'Bio': 'Biology',
        'Phy': 'Physics',
        'Agri': 'Agriculture',
        'Busn': 'Business',
        'Hist': 'History',
        'Geo': 'Geography',
        'Cre': 'CRE'
    };
    const fullUnitName = subjectMapping[selectedUnit];

    useEffect(() => {
        const decodeData = () => {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            return decodedToken.name;
        };
        const teacherName = decodeData();

        // Fetch assigned units from the backend
        const uri = `https://edumax.fly.dev/classes/assigned-units/${teacherName}`;
        axios.get(uri)
            .then(response => {
                const data = response.data;
                if (data.length > 0) {
                    // Combine streams and units without duplicates
                    const uniqueStreams = [...new Set(data.map(item => item.stream))];
                    const uniqueUnits = [...new Set(data.flatMap(item => item.units))];

                    setStreams(uniqueStreams);
                    setUnits(uniqueUnits);

                    console.log('Streams:', uniqueStreams);
                    console.log('Units:', uniqueUnits);
                } else {
                    setEmpty("No Units Allocated Yet");
                }
            })
            .catch(error => {
                console.error('Error fetching assigned units:', error);
            });
    }, []);

    const fetchStudentsAndMarks = () => {
        setIsLoading(true);
        setMarks({});
        setStudents([]);
        const uri = "https://edumax.fly.dev/api/student/UpdMark";
        axios.get(uri, {
            params: {
                year: selectedYear,
                examType: selectedExamType,
                stream: selectedStream,
                subject: fullUnitName
            }
        })
            .then(response => {
                setIsLoading(false);
                const data = response.data;
                if (response.status === 202) {
                    setNotification(data);
                } else if (response.status === 200) {
                    // Sort students based on admission number in ascending order
                    const sortedData = data.sort((a, b) => a.studentAdmission.localeCompare(b.studentAdmission));

                    setStudents(sortedData);
                    setNotification('');
                    setUpdateMessage('');
                    const marksData = {};
                    sortedData.forEach(student => {
                        marksData[student._id] = student.marks;
                    });
                    setMarks(marksData);
                } else if (response.status === 201) {
                    setNotification("No Data yet in the database");
                } else {
                    setNotification(data);
                }
            })
            .catch(error => {
                setIsLoading(false);
                setNotification('Error fetching data');
                console.error('Error fetching data:', error);
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
        const updates = students.map(student => ({
            id: student._id,
            unit: fullUnitName,
            examType: selectedExamType,
            year: selectedYear,
            marks: marks[student._id]
        }));

        setIsLoadingUpdate(true);
        const uri = "https://edumax.fly.dev/api/student/putMark";
        axios.put(uri, updates)
            .then(response => {
                setIsLoadingUpdate(false);
                setUpdateMessage('Marks updated successfully!');
                setStudents([]);
                setMarks({});
                console.log('Marks updated:', response.data);
            })
            .catch(error => {
                setIsLoadingUpdate(false);
                setUpdateMessage('Error updating marks, please try again.');
                console.error('Error updating marks:', error);
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
            return (
                <th className='th th-p1'>P1</th>
            );
        }
        return null;
    };

    return (
        <div className="update-marks-container">
            <div className="form-update">
                <div className="form-control">
                    <label>Stream</label>
                    <select value={selectedStream} onChange={(e) => setSelectedStream(e.target.value)}>
                        <option value="">Select Stream</option>
                        {streams.map((stream, index) => (
                            <option key={index} value={stream}>{stream}</option>
                        ))}
                    </select>
                </div>
                <div className="form-control">
                    <label>Unit</label>
                    <select value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)}>
                        <option value="">Select Unit</option>
                        {units.map((unit, index) => (
                            <option key={index} value={unit}>{unit}</option>
                        ))}
                    </select>
                </div>
                <div className="form-control">
                    <label>Term</label>
                    <select value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)}>
                        <option value="">Select Term</option>
                        {terms.map((term, index) => (
                            <option key={index} value={term}>{term}</option>
                        ))}
                    </select>
                </div>
                <div className="form-control">
                    <label>Exam Type</label>
                    <select value={selectedExamType} onChange={(e) => setSelectedExamType(e.target.value)}>
                        <option value="">Select Exam Type</option>
                        {examTypes.map((examType, index) => (
                            <option key={index} value={examType}>{examType}</option>
                        ))}
                    </select>
                </div>
                <div className="form-control">
                    <label>Year</label>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                        <option value="">Select Year</option>
                        {years.map((year, index) => (
                            <option key={index} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div>
                <center><button className="button-update" onClick={fetchStudentsAndMarks}>Fetch Students and Marks</button>
                <div className='feedback'>
                {empty && <p>{empty}</p>}
                {notification && <p>{notification}</p>}
                {isLoading && <p>Loading...</p>}
                </div>
                </center>
                
            </div>
            {students.length > 0 && (
                <>
                    <table className="students-table">
                        <thead>
                            <tr>
                                <th className='th th-adm'>Admission Number</th>
                                <th className='th th-name'>Name</th>
                                {renderTableHeaders()}
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student._id}>
                                    <td className='td td-adm'>{student.studentAdmission}</td>
                                    <td className='td td-name'>{student.studentName}</td>
                                    {renderPaperFields(student)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div>
                        <button className="button-update " onClick={handleSubmit}>Update Marks</button>
                        {isLoadingUpdate && <p>Updating...</p>}
                        {updateMessage && <p>{updateMessage}</p>}
                    </div>

                </>
            )}
        </div>
    );
};

export default UpdateStudentMarks;
