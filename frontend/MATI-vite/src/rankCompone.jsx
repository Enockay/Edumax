import React, { useState } from 'react';
import axios from 'axios';
import '../css/rankComponet.css';

const Results = () => {
  const [classes, setClasses] = useState(['Form 1', 'Form 2', 'Form 3', 'Form 4']);
  const [termExam, setTermExam] = useState(['End Of Term1 Exam', 'Mid-Term Exam', 'End Of Term2 Exam', 'End Of Third Term Exam']);
  const [streams, setStreams] = useState(['East', 'West']);
  const [years, setYears] = useState(['2021', '2022', '2023', '2024']);

  const [teacher, setTeacher] = useState('');
  const [singleClass, setSingleClass] = useState('');
  const [term, setTerm] = useState('');
  const [year, setYear] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStream, setSelectedStream] = useState('');

  const [results, setResults] = useState('');
  const [notification, setNotification] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePrintOverallResults = async () => {
    const fileName = `${singleClass} Results.pdf`;
    const url = `https://edumax.fly.dev/download-pdf/${encodeURIComponent(fileName)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const blob = await response.blob();
      const blobURL = URL.createObjectURL(blob);
      const printWindow = window.open(blobURL);
      printWindow.onload = () => {
        printWindow.print();
      };
    } catch (error) {
      setNotification(`Server has not yet produced ${singleClass} Results. Kindly generate the results first.`);
      setNotificationType('error');
      console.error("Error downloading PDF:", error);
    }
  };

  const generateResults = async () => {
    setIsLoading(true);
    setNotification(`Generating ${singleClass} provisional results in progress..`);
    setNotificationType('info');

    try {
      let stream;
      if (singleClass === 'Form 1') {
        stream = 1;
      } else if (singleClass === 'Form 2') {
        stream = 2;
      } else if (singleClass === 'Form 3') {
        stream = 3;
      } else if (singleClass === 'Form 4') {
        stream = 4;
      } else {
        stream = singleClass;
      }

      const url = `https://edumax.fly.dev/generateResult`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stream, term, teacher })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const feedback = await response.json();

      setIsLoading(false);
      setNotification(feedback);
      setNotificationType('success');
    } catch (error) {
      setIsLoading(false);
      setNotification(`Error: ${error.message}`);
      setNotificationType('error');
      console.error(error);
    }
  };

  const generateClassResults = async () => {
    setNotification(`Generating ${selectedClass} ${selectedStream} Results and Individual Report in Progress..`);
    setNotificationType('info');
    try {
      const response = await axios.get(`/api/students`, {
        params: { class: selectedClass, stream: selectedStream, year, term }
      });
      setResults(response.data);
      setNotification('Results generated successfully.');
      setNotificationType('success');
    } catch (error) {
      setNotification(`Error: ${error.message}`);
      setNotificationType('error');
      console.error(error);
    }
  };

  const cancelProgress = () => {
    setNotification('System terminated the process. Kindly refresh the system.');
    setNotificationType('error');
  };

  return (
    <div className="results-container">
      <div className="form-container">
        <div className='whole-class'>
          <h4 className='title'>Overall Class Results</h4>
          <div className='selects'>
            <div className="select-group">
              <label htmlFor="class-select">Form:</label>
              <select id="class-select" value={singleClass} onChange={(e) => setSingleClass(e.target.value)}>
                <option value="">--Select Form--</option>
                {classes.map((className, index) => (
                  <option key={index} value={className}>{className}</option>
                ))}
              </select>
            </div>
            <div className="select-group">
              <label htmlFor="term-select">Exam Period:</label>
              <select id="term-select" value={term} onChange={(e) => setTerm(e.target.value)} required>
                <option value="">--Select Period--</option>
                {termExam.map((termName, index) => (
                  <option key={index} value={termName}>{termName}</option>
                ))}
              </select>
            </div>
          </div>
       {/** <div className='select-group'>
            <label htmlFor="teacher-input" className='teacher'>Class Teacher:</label>
            <input id="teacher-input" type='text' value={teacher} onChange={(e) => setTeacher(e.target.value)} required />
          </div>
        */}   
          <div className='button-results'>
            <button className='button' onClick={generateResults} disabled={!singleClass || !term}>Generate Results</button>
            <button className='button' onClick={handlePrintOverallResults} disabled={!results}>Print Results</button>
          </div>
        </div>
        <div className='class-results'>
          <h4 className='title'>Class Results</h4>
          <div className="selection-container">
            <div className="select-group">
              <label htmlFor="class-select">Class:</label>
              <select id="class-select" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                <option value="">--Select Class--</option>
                {classes.map((className, index) => (
                  <option key={index} value={className}>{className}</option>
                ))}
              </select>
            </div>
            <div className="select-group">
              <label htmlFor="stream-select">Select Stream:</label>
              <select id="stream-select" value={selectedStream} onChange={(e) => setSelectedStream(e.target.value)}>
                <option value="">--Select Stream--</option>
                {streams.map((streamName, index) => (
                  <option key={index} value={streamName}>{streamName}</option>
                ))}
              </select>
            </div>
            <div className="select-group">
              <label htmlFor="term-select">Exam Period:</label>
              <select id="term-select" value={term} onChange={(e) => setTerm(e.target.value)} required>
                <option value="">--Select Period--</option>
                {termExam.map((termName, index) => (
                  <option key={index} value={termName}>{termName}</option>
                ))}
              </select>
            </div>
          </div>
          <div className='button-results'>
            <button className='button' onClick={generateClassResults} disabled={!selectedClass || !selectedStream}>Generate Class Results</button>
            <button className='button' onClick={handlePrintOverallResults} disabled={!results}>Print Class Results</button>
          </div>
        </div>
      </div>
      <div  className='select-notification'>
         <div className='notification'>
            <center><h3 className='noti' style={{color:"green"}}>Server Response</h3></center> 
             <div className='spinner-container'>
             {isLoading ? <span className="spinner"></span> : <div className={`notification-message ${notificationType}`}>{notification}</div>}
        </div>
      </div>
      </div>
     
    </div>
  );
};

export default Results;
