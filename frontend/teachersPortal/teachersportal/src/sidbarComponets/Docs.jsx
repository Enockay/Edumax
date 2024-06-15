import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import './css/Document.css';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [teacherName, setTeacherName] = useState('');
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [viewItems, setViewItems] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [loadingViewItems, setLoadingViewItems] = useState(false);
  const [documentaryName, setDocumentaryName] = useState('');

  const getDocumentaries = async (name) => {
    try {
      setLoadingDocuments(true);
      const url = `https://edumax.fly.dev/docs/savedDoc/${name}`;
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        if (result.message.length > 0) {
          setDocuments(result.message);
          setViewItems([]);
          setFeedback("");
        } else {
          setFeedback("Your documentary is empty");
        }
      } else {
        setError('Failed to retrieve documents');
      }
    } catch (error) {
      setError('Error occurred while retrieving documents');
    } finally {
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
    const retrieveToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        setTeacherName(decoded.name);
        getDocumentaries(decoded.name);
      }
    };

    retrieveToken();
  }, []);

  const viewDocument = async (documentaryName) => {
    try {
      setLoadingViewItems(true);
      const url = "https://edumax.fly.dev/docs/view";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ documentaryName, teacherName })
      });

      const feedback = await response.json();
      if (feedback.success) {
        setViewItems(feedback.message.students);
        setDocumentaryName(documentaryName);
        setFeedback("");
        setDocuments([]);
      } else {
        setError("Document not found");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoadingViewItems(false);
    }
  };

  const closeDocument = () => {
    setViewItems([]);
    setDocuments(prevDocuments => prevDocuments);
  };

  return (
    <div className="document-container">
      <header>
        <h3>Saved Documents</h3>
        <div className="intro">
          <p>All the documentaries you have added will display here. To view a document, simply double-click on the document name to see the content in.</p>
        </div>
      </header>
      {loadingDocuments ? (
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
      {loadingViewItems ? (
        <div className="spinner"></div>
      ) : (
        viewItems.length > 0 && (
          <div className="view-items">
            <center><p>{documentaryName}</p></center>
            <button className="close-button" onClick={closeDocument}>Close</button>
            <label className="view-title">{viewItems[0].documentaryName}</label>
            <table className="view-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ADM NO</th>
                  <th>Student Name</th>
                  <th>Item Id</th>
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
