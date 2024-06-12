import React, { useState } from 'react';
import axios from 'axios';
import '../css/rankComponet.css';

const Results = () => {
  const [classes, setClasses] = useState(['Form 1', 'Form 2', 'Form 3', 'Form 4']);
  const [termExam, setTermExam] = useState(['Term 1', 'Term 2', 'Term 3']);
  const [streams, setStreams] = useState(['East', 'West']);
  const [years, setYears] = useState(['2021', '2022', '2023', '2024']);
  const [examTypes] = useState(['CAT', 'Midterm', 'Endterm', 'TestExam']);
  const [exams, setExams] = useState('');
  const [teacher, setTeacher] = useState('');
  const [singleClass, setSingleClass] = useState('');
  const [term, setTerm] = useState('');
  const [year, setYear] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [classExamPeriod, setclassExamPeriod] = useState('');
  const [results, setResults] = useState('');
  const [notification, setNotification] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [examType ,setExamType]  = useState('');

  const getCurrentYear = () => {
    const now = new Date();
    return now.getFullYear();
};

const currentYear = getCurrentYear();

  const handlePrintOverallResults = async () => {
    setIsLoading(true);
    setNotification("System Availing Results for Printing");
    setNotificationType("success");

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
        stream = 0;
      }
    const fileName = `${singleClass} Results.pdf`;
    const examType = exams;
    const url = `https://edumax.fly.dev/download-pdf/${year}/${term}/${examType}/${fileName}/${stream}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const blob = await response.blob();
      if(blob){
        setIsLoading(false);
        setNotification("Results Are Available calling Automatic printing ");
        setNotificationType("info")

      const blobURL = URL.createObjectURL(blob);
      const printWindow = window.open(blobURL);
      printWindow.onload = () => {
        printWindow.print();
      };
    }
    } catch (error) {
      setNotification(`Server has not yet produced ${singleClass} Results. Kindly generate the results first.`);
      setNotificationType('error');
      console.error("Error downloading PDF:", error);
    }
  };

  const printReportForms = async () => {
    try {
      if(!examType || !selectedClass||!selectedStream){
        setNotification("All items required in Class Results field");
        setNotificationType('error');
        return;
      }
      setNotification("Prepairing reportForms ")
      const term = classExamPeriod;
      const year = currentYear;
      let stream;
      if (selectedClass === 'Form 1') {
        stream = `1${selectedStream}`;
      } else if (selectedClass === 'Form 2') {
        stream = `2${selectedStream}`;
      } else if (selectedClass === 'Form 3') {
        stream = `3${selectedStream}`;
      } else if (selectedClass === 'Form 4') {
        stream = `4${selectedStream}`;
      } else {
        stream = null;
      }
  
      // Indicate loading state
      setIsLoading(true);
      setNotification("System Availing ReportForms for Printing");
      const response = await fetch(`http://localhost:3000/download-report?year=${year}&term=${term}&stream=${stream}&examType=${examType}`, {
        method: 'GET',
      });
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      // Convert the response to a blob
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const blobURL = URL.createObjectURL(blob);
      
      // Open a new window and print the PDF
      const printWindow = window.open(blobURL);
      printWindow.onload = () => {
        printWindow.print();
        // Optionally close the window after printing
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      };
      setNotification('ReportForms are now available for printing')
    } catch (error) {
      console.error('Error downloading report:', error);
      // Handle error (e.g., display an error message to the user)
      alert('Error downloading report. Please try again.');
    } finally {
      // Reset loading state
      setIsLoading(false);
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

      const url = `http://localhost:3000/generateResult`;
      const Teacher = "Mr."
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stream, term, Teacher, year, exams })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const feedback = await response.json();
      console.log(feedback);

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
    setIsLoading(true);
    setNotification(`Generating ${selectedClass} ${selectedStream} Results and Individual Report in Progress..`);
    setNotificationType('info');
    try {
      let stream;
      if (selectedClass === 'Form 1') {
        stream = `1${selectedStream}`;
      } else if (selectedClass === 'Form 2') {
        stream = `2${selectedStream}`;
      } else if (selectedClass === 'Form 3') {
        stream = `3${selectedStream}`;
      } else if (selectedClass === 'Form 4') {
        stream = `4${selectedStream}`;
      } else {
        stream = null;
      }

      const items = {
        year : year,
        stream : stream,
        examType : examType,
        term : classExamPeriod
      }
      const response = await fetch(`http://localhost:3000/generate/reportForms`, {
         method : "POST",
         headers : {
          "Content-Type": "application/json"
         },
         body : JSON.stringify(items)
      });
      const data = await response.json();
      console.log(data)
      setIsLoading(false)
      setResults(data.data);
      setNotification('Results generated successfully.');
      setNotificationType('success');
    } catch (error) {
      setIsLoading(false);
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
    <>
      <div className="results-container">
        <div className="rank-form-container">
          <div className='info-items'>
            <center><h4 style={{ margin: 0, color:"blue"}}>To generate the overall class results:</h4></center>
            <ul>
              <li>Select the appropriate form, exam period, year, and exam type.</li>
              <li>Click on the "Generate Results" button to generate the results.</li>
              <li>Once generated, you can print the results by clicking on the "Print Results" button.</li>
              <center><h6 style={{margin:0,color:"green"}}>You still Retrieve past Results you just print them automatically</h6></center>
            </ul>
          </div>
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
              <div className="select-group">
                <label htmlFor="term-select">Year:</label>
                <select id="term-select" value={year} onChange={(e) => setYear(e.target.value)} required>
                  <option value="">--Select Year--</option>
                  {years.map((termName, index) => (
                    <option key={index} value={termName}>{termName}</option>
                  ))}
                </select>
              </div>
              <div className="select-group">
                <label htmlFor="term-select">Exam type:</label>
                <select id="term-select" value={exams} onChange={(e) => setExams(e.target.value)} required>
                  <option value="">--Select Exam Type--</option>
                  {examTypes.map((termName, index) => (
                    <option key={index} value={termName}>{termName}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className='button-results'>
              <button className='button' onClick={generateResults} disabled={!singleClass || !term}>Generate Results</button>
              <button className='button' onClick={handlePrintOverallResults} disabled={!singleClass}>Print Results</button>
            </div>
          </div>

          <div className='info-items'>
            <center><h4 style={{ margin: 0,color:"blue" }}>To generate individual student results:</h4> </center>
            <ul>
              <li>Select the class and stream, then choose the exam period.</li>
              <li>Click on the "Generate Class Results" button to generate individual student reports.</li>
              <li>Once generated, you can print the results by clicking on the "Print Class Results" button.</li>
            </ul>
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
                <label htmlFor="term-select">ExamType:</label>
                <select id="term-select" value={examType} onChange={(e) => setExamType(e.target.value)} required>
                  <option value="">--Select ExamType--</option>
                  {examTypes.map((termName, index) => (
                    <option key={index} value={termName}>{termName}</option>
                  ))}
                </select>
              </div>
              <div className="select-group">
                <label htmlFor="term-select">Exam Period:</label>
                <select id="term-select" value={classExamPeriod} onChange={(e) => setclassExamPeriod(e.target.value)} required>
                  <option value="">--Select Period--</option>
                  {termExam.map((termName, index) => (
                    <option key={index} value={termName}>{termName}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className='button-results'>
              <button className='button' onClick={generateClassResults} disabled={!selectedClass || !selectedStream}>Generate Class Results</button>
              <button className='button' onClick={printReportForms} >Print ReportForms </button>
            </div>
          </div>
        </div>
        <div className='select-notification'>
          <div className='notification'>
            <center><h3 className='noti' style={{ color: "green" }}>Server Response</h3></center>
            <div className='spinner-container'>
              {isLoading && <span className="spinning"></span>}
             <center>
             <div className={`notification-message ${notificationType}`}>{notification}</div>
              </center> 
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Results;
