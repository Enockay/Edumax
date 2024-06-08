import React, { useState, useEffect } from 'react';
import {jwtDecode }from 'jwt-decode';
import './css/FileUpload.css';

const FileUpload = () => {
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notification, setNotification] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setTeacherName(decodedToken.name);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to upload files.');
      return;
    }

    const formData = new FormData();
    formData.append('className', className);
    formData.append('section', section);
    formData.append('teacherName', teacherName);
    formData.append('subject', subject);
    formData.append('dueDate', dueDate);
    formData.append('notification', notification);
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3000/exams/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      if (response.ok) {
        alert('File uploaded successfully!');
      } else {
        alert(`Failed to upload file: ${result.message}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    }
  };

  return (
    <div className="file-upload-container">
      <h2 className="file-upload-title">Upload Exam File</h2>
      <form className="file-upload-form" onSubmit={handleSubmit}>
        <div className="form-lft">
          <div className="form-gp">
            <label className="form-labeel">Class Name:</label>
            <input
              className="form-in"
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
            />
          </div>
          <div className="form-gp">
            <label className="form-labeel">Section:</label>
            <input
              className="form-in"
              type="text"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              required
            />
          </div>
          <div className="form-gp">
            <label className="form-labeel">Teacher's Name:</label>
            <input
              className="form-input"
              type="text"
              value={teacherName}
              readOnly
            />
          </div>
          <div className="form-gp">
            <label className="form-labeel">Subject:</label>
            <input
              className="form-in"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div className="form-g">
            <label className="form-labeel">Due Date:</label>
            <input
              className="form-in"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <div className="form-gp">
            <label className="form-labeel">File:</label>
            <input
              className="form-in"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
        </div>
        <div className="form-rit">
          <div className="form-gp">
            <label className="form-labeel">Notification:</label>
            <textarea
              className="form-txtarea"
              value={notification}
              onChange={(e) => setNotification(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="form-foot">
          <button className="form-btn" type="submit">Upload</button>
        </div>
      </form>
    </div>
  );
};

export default FileUpload;
