import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners'; // Import spinner component
import '../css/addTeacher.css'; // Import your CSS file for styling

const AddTeacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherNumber, setTeacherNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Spinner state

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('https://api.example.com/teachers');
      setTeachers(response.data);
    } catch (err) {
      setError('Network Error While fetching teachers');
    }
  };

  const generateUsername = (name) => {
    return name.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);
  };

  const generatePassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    const newUsername = generateUsername(teacherName);
    const newPassword = generatePassword();
    setUsername(newUsername);
    setPassword(newPassword);

    const newTeacher = {
      name: teacherName,
      email: teacherEmail,
      number: teacherNumber,
      username: newUsername,
      password: newPassword,
    };

    setIsLoading(true); // Show spinner
    try {
      const response = await axios.post('https://api.example.com/teachers', newTeacher);
      setFeedback('Teacher added successfully.');
      setTeachers([...teachers, response.data]);
      setTeacherName('');
      setTeacherEmail('');
      setTeacherNumber('');
      setUsername('');
      setPassword('');
      setError('');
    } catch (err) {
      setError('Failed to add teacher.');
    } finally {
      setIsLoading(false); // Hide spinner
    }
  };

  return (
    <div className="admin-panel-container">
      <h2 className="admin-panel-title">Admin Panel - Manage Teachers</h2>
      <div className="admin-panel-content">
        <div className="add-teacher-section">
          <form onSubmit={handleAddTeacher} className="admin-panel-form">
            <div className="form-group">
              <label htmlFor="teacherName">Teacher Name:</label>
              <input
                type="text"
                id="teacherName"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="teacherEmail">Teacher Email:</label>
              <input
                type="email"
                id="teacherEmail"
                value={teacherEmail}
                onChange={(e) => setTeacherEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="teacherNumber">Teacher Number:</label>
              <input
                type="text"
                id="teacherNumber"
                value={teacherNumber}
                onChange={(e) => setTeacherNumber(e.target.value)}
                required
              />
            </div>
            <div className="button-group">
             <center><button type="submit" className="btn btn-primary">Add Teacher</button></center> 
            </div>
            {isLoading && (
              <div className="spinner-container">
                <ClipLoader color="#007bff" loading={isLoading} size={50} />
                <p>Please wait, adding teacher...</p>
              </div>
            )}
            {feedback && <div className="success-message">{feedback}</div>}
          
          </form>
        </div>
        <div className="teachers-list-section">
          <h3 className="admin-panel-subtitle">List of Teachers</h3>
          <div className="teachers-list">
          {error && <div className="error-message">{error}</div>}
            {teachers.map((teacher) => (
              <div key={teacher.id} className="teacher-card">
                <h4>{teacher.name}</h4>
                <p><strong>Email:</strong> {teacher.email}</p>
                <p><strong>Number:</strong> {teacher.number}</p>
                <p><strong>Username:</strong> {teacher.username}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTeacher;
