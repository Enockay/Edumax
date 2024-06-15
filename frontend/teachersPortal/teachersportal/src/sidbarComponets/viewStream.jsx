import React, { useEffect, useState } from 'react';
import './css/Viewstream.css';
import {jwtDecode} from 'jwt-decode';

const streams = ['1East', '1West', '2East', '2West', '3East', '3West', '4East', '4West'];

const ViewStream = () => {
  const [selectedStream, setSelectedStream] = useState('');
  const [students, setStudents] = useState([]);
  const [uniqueItems, setUniqueItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [tally, setTally] = useState('');
  const [docName, setDocName] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [success, setSuccess] = useState('');
  const [savedDocs, setSavedDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const retrieveToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        const teacherName = decoded.name;
        setTeacherName(teacherName);
        await retrieveDocs(teacherName);
      }
    };
    retrieveToken();
  }, []);

  const retrieveDocs = async (teacherName) => {
    try {
      const response = await fetch(`https://edumax.fly.dev/docs/savedDoc/${teacherName}`);
      const result = await response.json();
      if (result.success) {
        setSavedDocs(result.message);
      } else {
        setFeedback('Error fetching documents');
      }
    } catch (error) {
      setFeedback('An error occurred while fetching documents');
    }
  };

  const handleStreamChange = (event) => {
    setSelectedStream(event.target.value);
  };

  const fetchStudents = async () => {
    if (selectedStream) {
      setLoading(true);
      setFeedback('');
      setStudents([]);
      setUniqueItems([]);

      try {
        const response = await fetch(`https://edumax.fly.dev/docs/stream/${selectedStream}`);
        const result = await response.json();
        setLoading(false);

        if (result.success) {
          const sortedStudents = result.students.sort((a, b) => a.admissionNumber - b.admissionNumber);
          setStudents(sortedStudents);
          setTally(sortedStudents.length);
          setUniqueItems(sortedStudents.map(() => ''));
          setFeedback(sortedStudents.length ? '' : 'No students found in this stream.');
        } else {
          setFeedback('Error fetching students, please try again.');
        }
      } catch (error) {
        setLoading(false);
        setFeedback('Error fetching students, please try again.');
      }
    } else {
      setFeedback('Please select a stream.');
    }
  };

  const handleUniqueItemChange = (index, value) => {
    const newUniqueItems = [...uniqueItems];
    newUniqueItems[index] = value;
    setUniqueItems(newUniqueItems);
  };

  const saveDocs = async () => {
    setFeedback("");
    const unifiedStudents = students.map((student, index) => ({
      admissionNumber: student.admissionNumber,
      fullName: student.fullName,
      uniqueItem: uniqueItems[index],
    }));

    const url = "https://edumax.fly.dev/docs/saveDocs";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ students: unifiedStudents, stream: selectedStream, docName, teacherName })
    });
    const feedback = await response.json();
    if (feedback.success) {
      setSuccess(feedback.message);
      setStudents([]);
    }
  };

  const fetchSavedDocDetails = async (docId) => {
    setLoading(true);
    setFeedback("");
    setSelectedDoc(docId);
    try {
      const response = await fetch(`https://edumax.fly.dev/docs/${docId}`);
      const result = await response.json();
      setLoading(false);

      if (result.success) {
        const doc = result.message;
        setSelectedStream(doc.stream);
        setDocName(doc.documentaryName);
        setUpdating(true);
        const sortedStudents = doc.students.sort((a, b) => a.admissionNumber - b.admissionNumber);
        setStudents(sortedStudents);
        setTally(sortedStudents.length);
        setUniqueItems(sortedStudents.map(student => student.uniqueItem));
      } else {
        setFeedback('Error fetching document details, please try again.');
      }
    } catch (error) {
      setLoading(false);
      setFeedback('Error fetching document details, please try again.');
    }
  };

  const updateDocs = async () => {
    const unifiedStudents = students.map((student, index) => ({
      admissionNumber: student.admissionNumber,
      fullName: student.fullName,
      uniqueItem: uniqueItems[index],
    }));

    const url = `https://edumax.fly.dev/docs/updateDocs/${selectedDoc}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ students: unifiedStudents, stream: selectedStream, docName, teacherName })
    });
    const feedback = await response.json();
    if (feedback.success) {
      setSuccess(feedback.message);
      setFeedback("");
      setStudents([]);
    }
  };

  return (
    <div className="view-stream-container">
      <h2 className="view-stream-title">Documentary</h2>
      <div className='doc'>
        <p className='p'>In this part you can create your own documentary and retrieve it later, e.g., keeping book allocation records.</p>
        <p className='p'>To get started, choose the stream and then fill in your documentary for each student.</p>
      </div>
      <div className="view-stream-form">
        <select className="stream-select" value={selectedStream} onChange={handleStreamChange}>
          <option value="">Select Stream</option>
          {streams.map(stream => (
            <option key={stream} value={stream}>{stream}</option>
          ))}
        </select>
        <button className="fetch-students-button" onClick={fetchStudents}>Fetch Students</button>
      </div>
      {loading && <div className="spinner"></div>}
      {feedback && !loading && <div className="feedback">{feedback}</div>}
      {success && !loading && <div className='success'>{success}</div>}
      {savedDocs.length > 0 &&
        <div className='update-doc'>
          <div className='select-doc'>
            <center>
              <h5 style={{ margin: 0 }}>Update Document</h5>
              <select value={selectedDoc} onChange={(e) => fetchSavedDocDetails(e.target.value)}>
                <option value="">Select Doc</option>
                {savedDocs.map((item) => (
                  <option key={item._id} value={item._id}>{item.documentaryName}</option>
                ))}
              </select>
            </center>
          </div>
        </div>
      }
      {students.length > 0 && !loading && (
        <>
          <div className='tally'>Stream has {tally} Students</div>
          <div className="actions">
            <label>
              Documentary Name
              <input value={docName} onChange={(e) => setDocName(e.target.value)} className='docName' />
            </label>
            {updating ? (
              <button className="submit-unique-items-button" onClick={updateDocs}>Update Doc</button>
            ) : (
              <button className="submit-unique-items-button" onClick={saveDocs}>Save Doc</button>
            )}
          </div>
          <table className="students-table">
            <thead>
              <tr>
                <th>#</th>
                <th>ADM NO</th>
                <th>Student Name</th>
                <th>Unique Id</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.admissionNumber}>
                  <td>{index + 1}</td>
                  <td>{student.admissionNumber}</td>
                  <td>{student.fullName}</td>
                  <td>
                    <input
                      type="text"
                      value={uniqueItems[index]}
                      onChange={(e) => handleUniqueItemChange(index, e.target.value)}
                      className='text-input'
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ViewStream;
