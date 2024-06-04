import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './css/FeedMarks.css';

const FeedMarks = () => {
    const [streams,setStream] = useState([]);
    const [units,setUnits] = useState([]);
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
    const [alert, setAlert] = useState('');

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

    /**useEffect(() => {
        const decodeData = ()=> {
          const token = localStorage.getItem('token');
          const decodedToken = jwtDecode(token);
          return decodedToken.name
        }
        const teacherName = decodeData();
    
        // Fetch assigned units from the backend
        const uri = `https://edumax.fly.dev/classes/assigned-units/${teacherName}`;
        fetch(uri,{
          params : `${teacherName}`
        })
          .then(response => response.json())
          .then(data => {
            console.log(data)
            if(data.length > 0){
              setUnits(data[0].teachingSubjects);
            }else{
               setEmpty("No Units Allocated Yet")
            }
            
          })
          .catch(error => {
            console.error('Error fetching assigned units:', error);
          });
      }, []);
    **/
    const fetchClassList = () => {
        if (!selectedStream || !selectedUnit) {
            setNotification('Stream and Subject fields cannot be empty');
            return;
        }

        const uri = 'https://edumax.fly.dev/students/';
        setIsLoading(true);
        setUpdate('');
        axios.get(uri, {
            params: {
                stream: selectedStream,
                unit: selectedUnit
            }
        })
            .then(response => {
                setIsLoading(false);
                if (response.data.length === 0) {
                    setNotification(`No data found for ${selectedStream} - ${selectedUnit}`);
                    setStudents([]);
                } else {
                    const sortedStudents = response.data.sort((a, b) => a.studentAdmission - b.studentAdmission);
                    setStudents(sortedStudents);
                    setNotification('');
                    fetchMarks(sortedStudents);
                }
            })
            .catch(error => {
                console.error('Error fetching students:', error);
                setIsLoading(false);
                setNotification('Error: Check your internet connection');
            });
    };

    const fetchMarks = (students) => {
        const uri = 'https://edumax.fly.dev/marks';
        axios.get(uri, {
            params: {
                stream: selectedStream,
                unit: selectedUnit,
                term: selectedTerm,
                examType: selectedExamType,
                year: selectedYear
            }
        })
            .then(response => {
                if (response.data.length > 0) {
                    const marksData = {};
                    response.data.forEach(mark => {
                        marksData[mark.studentId] = mark.marks;
                    });
                    setMarks(marksData);
                }
            })
            .catch(error => {
                console.error('Error fetching marks:', error);
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
        if (!selectedTerm || !selectedExamType || !selectedYear) {
            setAlert('Term, Exam Type, and Year fields must be filled');
            return;
        }

        const fullUnitName = subjectMapping[selectedUnit];

        const updates = students.map(student => ({
            id: student._id,
            unit: fullUnitName,
            examType: selectedExamType,
            year: selectedYear,
            term: selectedTerm,
            marks: {
                P1: marks[student._id]?.P1 || null,
                P2: marks[student._id]?.P2 || null,
                P3: marks[student._id]?.P3 || null
            }
        }));

        setIsLoadingUpdate(true);

        axios.put('https://edumax.fly.dev/students/marks', updates)
            .then(response => {
                setIsLoadingUpdate(false);
                setUpdate(response.data.message);
                console.log('Marks updated:', response.data);

                if (response.data && response.data.result) {
                    console.log('Bulk Write Result:', response.data.result);
                }

                if (response.data && response.data.updatedStudents) {
                    console.log('Updated Students:', response.data.updatedStudents);
                }

                setStudents([]);
                setMarks({});
                setSelectedStream('');
                setSelectedUnit('');
                setSelectedTerm('');
                setSelectedExamType('');
                setSelectedYear('');
            })
            .catch(error => {
                console.error('Error updating marks:', error);
                if (error.response && error.response.status === 403) {
                    setAlert('CORS issue: Check your server CORS configuration');
                } else {
                    setAlert('Error updating marks');
                }
                setIsLoadingUpdate(false);
            });
    };

    const renderPaperFields = (student) => {
        const fullUnitName = subjectMapping[selectedUnit];
        if (['3East', '3West', '4East', '4West'].includes(selectedStream)) {
            if (['Chemistry', 'Biology', 'Physics', 'English', 'Kiswahili'].includes(fullUnitName)) {
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
        const fullUnitName = subjectMapping[selectedUnit];
        if (['3East', '3West', '4East', '4West'].includes(selectedStream)) {
            if (['Chemistry', 'Biology', 'Physics', 'English', 'Kiswahili'].includes(fullUnitName)) {
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
        <div className='marks-main'>
            <div className='green-flag'>
                <center>
                    <p>You are only Allowed to feed Marks Of the assigned Units if You cant Find Any Select follow up for Units Allocation</p>
                </center>
            </div>
            <div className='marks-header'>
                <h3 className='title'>Feeding marks</h3>
                <div className='form'>
                    <div className='form-control'>
                        <label>Stream</label>
                        <select
                            value={selectedStream}
                            onChange={(e) => setSelectedStream(e.target.value)}
                        >
                            <option value="">Select Stream</option>
                            {streams.map((stream) => (
                                <option key={stream} value={stream}>
                                    {stream}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='form-control'>
                        <label>Subject</label>
                        <select
                            value={selectedUnit}
                            onChange={(e) => setSelectedUnit(e.target.value)}
                        >
                            <option value="">Select Subject</option>
                            {units.map((unit) => (
                                <option key={unit} value={unit}>
                                    {unit}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button className='btn' onClick={fetchClassList}>
                        {isLoading ? 'Loading...' : 'Fetch Students'}
                    </button>
                </div>
            </div>

            {notification && <p className='notification'>{notification}</p>}

            {students.length > 0 && (
                <>
                    <div className='items-form'>
                        <div className='form-control'>
                            <label>Term</label>
                            <select
                                value={selectedTerm}
                                onChange={(e) => setSelectedTerm(e.target.value)}
                            >
                                <option value="">Select Term</option>
                                {terms.map((term) => (
                                    <option key={term} value={term}>
                                        {term}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='form-control'>
                            <label>Exam Type</label>
                            <select
                                value={selectedExamType}
                                onChange={(e) => setSelectedExamType(e.target.value)}
                            >
                                <option value="">Select Exam Type</option>
                                {examTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='form-control'>
                            <label>Year</label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                <option value="">Select Year</option>
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {alert && <p className='notification'>{alert}</p>}
                    <table>
                        <thead>
                            <tr>
                                <th className='th'>#</th>
                                <th className='th'>Adm</th>
                                <th className='th'>Name</th>
                                {renderTableHeaders()}
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr key={student._id}>
                                    <td className='td'>{index + 1}</td>
                                    <td className='td'>{student.studentAdmission}</td>
                                    <td className='td'>{student.studentName}</td>
                                    {renderPaperFields(student)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <center>
                        <button className='btn' onClick={handleSubmit}>
                            {isLoadingUpdate ? 'Updating...' : 'Submit Marks'}
                        </button>
                    </center>
                    {update && <p className='update-message'>{update}</p>}
                </>
            )}
        </div>
    );
};

export default FeedMarks;
