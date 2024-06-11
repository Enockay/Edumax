import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import '../css/addTeacher.css';

const AddTeacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('https://edumax.fly.dev/staff/fetch');
      setTeachers(response.data);
    } catch (err) {
      setError('Network Error While fetching teachers');
    }
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    const newTeacher = {
      name: teacherName,
      email: teacherEmail,
    };

    setIsLoading(true);
    try {
      const response = await axios.post('https://edumax.fly.dev/staff/post', newTeacher);
      setFeedback('Teacher added successfully.');
      setTeachers([...teachers, response.data]);
      setTeacherName('');
      setTeacherEmail('');
      setError('');
    } catch (err) {
      setError('Failed to add teacher.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await axios.delete(`https://edumax.fly.dev/staff/${id}`);
      setTeachers(teachers.filter(teacher => teacher._id !== id));
      setFeedback('Teacher deleted successfully.');
    } catch (err) {
      setDeleteError('Failed to delete teacher.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="add-teacher-container">
      <h2 className="add-teacher-title">Admin Panel - Manage Teachers</h2>

      <div className="instructions-container">
        <h3>Instructions</h3>
        <p>To manage the teachers' accounts effectively, please follow these steps:</p>
        <ul>
          <li>To add a new teacher, fill in the name and email fields and click "Add Teacher".</li>
          <li>To delete a teacher, click the "Delete" button next to their name in the list.</li>
          <li>Ensure all information is correct before proceeding.</li>
        </ul>
      </div>

      <div className="content-container">
        <div className="form-section">
          <form onSubmit={handleAddTeacher} className="teacher-form">
            <div className="Add-form-group">
              <label htmlFor="teacherName">Teacher Name:</label>
              <input
                type="text"
                id="teacherName"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                required
              />
            </div>
            <div className="Add-form-group">
              <label htmlFor="teacherEmail">Teacher Email:</label>
              <input
                type="email"
                id="teacherEmail"
                value={teacherEmail}
                onChange={(e) => setTeacherEmail(e.target.value)}
                required
              />
            </div>
            <div className="button-group">
              <button type="submit" className="btn-primary">Add Teacher</button>
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
          <h3>List of Teachers</h3>
          {error && <div className="error-message">{error}</div>}
          {deleteError && <div className="error-message">{deleteError}</div>}
          {isDeleting && (
            <div className="spinner-container">
              <ClipLoader color="#007bff" loading={isDeleting} size={50} />
              <p>Please wait, deleting teacher...</p>
            </div>
          )}
          <table className="teachers-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher._id}>
                  <td>{teacher.name}</td>
                  <td>{teacher.email}</td>
                  <td>
                    <button
                      className="btn-danger"
                      onClick={() => handleDeleteTeacher(teacher._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="important-notice">
        <h3>Important Notice</h3>
        <p>If any account is deleted, the teacher will lose access to their account details and data associated with the school system.</p>
        <ul>
          <li>All grades, assignments, and other records managed by the teacher will be permanently removed.</li>
          <li>This action cannot be undone, so proceed with caution.</li>
        </ul>
      </div>
    </div>
  );
};

export default AddTeacher;
