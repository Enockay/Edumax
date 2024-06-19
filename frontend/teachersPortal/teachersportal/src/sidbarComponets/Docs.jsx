import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import './css/Document.css';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [teacherName, setTeacherName] = useState('');
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [viewItems, setViewItems] = useState([]);
  const [loading, setLoading] = useState({ documents: false, viewItems: false });
  const [documentaryName, setDocumentaryName] = useState('');
  const [availableDoc, setAvailableDoc] = useState([]);

  const getDocumentaries = async (name) => {
    try {
      setLoading((prevState) => ({ ...prevState, documents: true }));
      const response = await fetch(`https://edumax.fly.dev/docs/savedDoc/${name}`);
      const result = await response.json();
      if (result.success) {
        setDocuments(result.message);
        setAvailableDoc(result.message);
        setFeedback('');
      } else {
        setFeedback('Your documentary is empty');
      }
    } catch (error) {
      setError('Error occurred while retrieving documents');
    } finally {
      setLoading((prevState) => ({ ...prevState, documents: false }));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setTeacherName(decoded.name);
      getDocumentaries(decoded.name);
    }
  }, []);

  const viewDocument = async (documentaryName) => {
    try {
      setLoading((prevState) => ({ ...prevState, viewItems: true }));
      const response = await fetch("https://edumax.fly.dev/docs/view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ documentaryName, teacherName })
      });

      const feedback = await response.json();
      if (feedback.success) {
        setViewItems(feedback.message[0].students);
        setDocumentaryName(documentaryName);
        setDocuments([]);
      } else {
        setError('Document not found');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading((prevState) => ({ ...prevState, viewItems: false }));
    }
  };

  const closeDocument = () => {
    setViewItems([]);
    setDocuments(availableDoc);
  };

  return (
    <div className="document-container">
      <header>
        <h3>Saved Documents</h3>
        <div className="intro">
          <p>All the documentaries you have added will display here. To view a document, simply double-click on the document name to see the content.</p>
        </div>
      </header>
      {loading.documents ? (
        <div className="spinner"></div>
      ) : (
        <>
          {documents.length > 0 ? (
            <div className="doc-list">
              <ul>
                {documents.map((item, index) => (
                  <li key={index} onDoubleClick={() => viewDocument(item.documentaryName)}>
                    <h5>{item.documentaryName}</h5>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="feedback">
              <h5>{feedback}</h5>
            </div>
          )}
        </>
      )}
      {error && <div className="error">{error}</div>}
      {loading.viewItems ? (
        <div className="spinner"></div>
      ) : (
        viewItems.length > 0 && (
          <div className="view-items">
            <center><p>{documentaryName}</p></center>
            <button className="close-button" onClick={closeDocument}>Close</button>
            <table className="view-table">
              <thead>
                <tr>
                  <th id="th">#</th>
                  <th id="th">ADM NO</th>
                  <th id="th">Student Name</th>
                  <th id="th">Item Id</th>
                </tr>
              </thead>
              <tbody>
                {viewItems.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.admissionNumber}</td>
                    <td>{item.fullName}</td>
                    <td>{item.uniqueItem}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default Documents;
