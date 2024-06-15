import React, { useState } from 'react';
import './css/searchStudent.css';

const StudentSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (searchQuery.trim() !== '') {
      setLoading(true);
      setFeedback('');
      setStudents([]);

      try {
        const response = await fetch(`https://edumax.fly.dev/students/search?query=${searchQuery}`);
        const result = await response.json();
        setLoading(false);

        if (result.success) {
          setStudents(result.students);
          setFeedback(result.students.length ? '' : 'No students found.');
        } else {
          setFeedback('Error searching students, please try again.');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        setLoading(false);
        setFeedback('Error searching students, please try again.');
      }
    } else {
      setFeedback('Please enter a valid search query.');
    }
  };

  return (
    <div className="student-search-container">
      <h2 style={{margin:0}}className="student-search-title">Search Student</h2>
      <div className='doc'>
        <p className='p'>You can try search student based on any clue you have about the student ie lastname,admission,firstname etc</p>
      </div>
      <div className="student-search-form">
        <input
          className="student-search-input"
          type="text"
          placeholder="Enter student admission number or name"
          value={searchQuery}
          style={{width:"50%"}}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="student-search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
      {loading && <div className="spinner"></div>}
      <div className='feedback'>
      {feedback && !loading && <div className="feedback">{feedback}</div>}
      </div>
      <div className='display-students'>
      {students.length > 0 && !loading && (
        <div className="student-cards-container">
          {students.map(student => (
            <div key={student.admissionNumber} className="student-card">
              <h3>Student details found</h3>
              <h4>Student Name :{student.fullName}</h4>
              <p>Admission No.: {student.admissionNumber}</p>
              <p>Class: {student.stream}</p>
              <p>K.C.P.E Index: {student.kcpeIndex}</p>
              <p>Date of Admission: {student.dateOfAdmission}</p>
            </div>
          ))}
        </div>
      )}
      </div> 
    </div>
  );
};

export default StudentSearch;
