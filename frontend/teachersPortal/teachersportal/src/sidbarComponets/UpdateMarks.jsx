import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/UpdMarks.css';

const UpdateStudentMarks = () => {
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
    const [marks, setMarks] = useState({});
    const [notification, setNotification] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [updateMessage, setUpdateMessage] = useState('');

    const fetchStudentsAndMarks = () => {
        setIsLoading(true);
        setMarks({});
        setStudents([])
        const uri = "https://edumax.fly.dev/api/stdent/UpdMark"
        axios.get(uri, {
            params: {
                year: selectedYear,
                examType: selectedExamType,
                stream: selectedStream,
                subject: selectedUnit
            }
        })
        .then(response => {
            setIsLoading(false);
            const data = response.data;
           if(response.status == 202){
            setNotification(data)
           }else if(response.status == 200){
            setStudents(data)
            setNotification('');
            setUpdateMessage('');
            const marksData = {};
            response.data.forEach(student => {
                marksData[student._id] = student.marks;
            });
            setMarks(marksData);
           }else if (response.status == 201){
            setNotification("No Data yet in the database")
           }else{
             setNotification(data)
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
            unit: selectedUnit,
            examType: selectedExamType,
            year: selectedYear,
            marks: marks[student._id]
        }));

        setIsLoadingUpdate(true);
       const uri = "https://edumax.fly.dev/api/stdent/putMark";
        axios.put(uri, updates)
            .then(response => {
                setIsLoadingUpdate(false);
                setUpdateMessage('Marks updated successfully!');
                console.log('Marks updated:', response.data);
            })
            .catch(error => {
                setIsLoadingUpdate(false);
                setUpdateMessage('Error updating marks, please try again.');
                console.error('Error updating marks:', error);
            });
    };

    return (
        <div className="update-marks-container">
            <h3>Update Student Marks</h3>
            <div className="form-update">
                <div className="form-control">
                    <label>Stream</label>
                    <select value={selectedStream} onChange={(e) => setSelectedStream(e.target.value)}>
                        <option value="">Select Stream</option>
                        {streams.map(stream => (
                            <option key={stream} value={stream}>{stream}</option>
                        ))}
                    </select>
                </div>
                <div className="form-control">
                    <label>Subject</label>
                    <select value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)}>
                        <option value="">Select Subject</option>
                        {units.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </select>
                </div>
                <div className="form-control">
                    <label>Term</label>
                    <select value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)}>
                        <option value="">Select Term</option>
                        {terms.map(term => (
                            <option key={term} value={term}>{term}</option>
                        ))}
                    </select>
                </div>
                <div className="form-control">
                    <label>Exam Type</label>
                    <select value={selectedExamType} onChange={(e) => setSelectedExamType(e.target.value)}>
                        <option value="">Select Exam Type</option>
                        {examTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div className="form-control">
                    <label>Year</label>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                        <option value="">Select Year</option>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <button className="button" onClick={fetchStudentsAndMarks}>
                    {isLoading ? 'Loading...' : 'Fetch Marks'}
                </button>
            </div>
            {notification && <p className="notification">{notification}</p>}

            {students.length > 0 && (
                <>
                    <table className="marks-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Admission No</th>
                                <th>Name</th>
                                <th>P1</th>
                                <th>P2</th>
                                <th>P3</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr key={student._id}>
                                    <td>{index + 1}</td>
                                    <td>{student.studentAdmission}</td>
                                    <td>{student.studentName}</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={marks[student._id]?.P1 || ''}
                                            onChange={(e) => handleMarkChange(student._id, 'P1', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={marks[student._id]?.P2 || ''}
                                            onChange={(e) => handleMarkChange(student._id, 'P2', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={marks[student._id]?.P3 || ''}
                                            onChange={(e) => handleMarkChange(student._id, 'P3', e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                <center>  <button className="btn" onClick={handleSubmit}>
                        {isLoadingUpdate ? 'Updating...' : 'Update Marks'}
                    </button>
                 </center>    
                    {updateMessage && <p className="notification">{updateMessage}</p>}
                </>
            )}
        </div>
    );
};

export default UpdateStudentMarks;
