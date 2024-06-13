import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import ClipLoader from 'react-spinners/ClipLoader';
import './css/FileUpload.css';

const FileUpload = () => {
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notification, setNotification] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setTeacherName(decodedToken.name);
    }
  }, []);

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://edumax.fly.dev/exams/uploadFile', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to upload file');
    }
    return result.fileId;  // Return fileId
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to upload files.');
      return;
    }

    setIsLoading(true);

    try {
      const fileId = await handleFileUpload();  // Get fileId

      const data = {
        className,
        section,
        teacherName,
        subject,
        dueDate,
        notification,
        fileId,  // Use fileId
        token
      };

      const response = await fetch('https://edumax.fly.dev/exams/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      setIsLoading(false);

      if (response.ok) {
        setSuccessMessage('File uploaded successfully!');
        setError('');
      } else {
        setError(`Failed to upload file: ${result.message}`);
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsLoading(false);
      setError('Failed to upload file');
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
          <button className="form-btn" type="submit" disabled={isLoading}>Upload</button>
        </div>
      </form>
      <center>
      {isLoading && (
        <div className="spinner-container">
          <ClipLoader color="#007bff" loading={isLoading} size={20} />
          <p className="spinner-text">Uploading...</p>
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      </center>
     </div>
  );
};

export default FileUpload;
