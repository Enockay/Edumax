import React, { useState } from "react";
import "./css/classes.css";

const Classes = () => {
  const streams = ["Form 4 East", "Form 4 West", "Form 3 East", "Form 3 West", "Form 2 East", "Form 2 West", "Form 1 East", "Form 1 West"];
  const units = ["Math", "Kisw", "Eng", "Chem", "Phy", "Bio", "Cre", "Agri", "Busn", "Hist", "Geog"];
  const terms = ["Term 1", "Term 2", "Term 3"];

  const [year, setYear] = useState("");
  const [term, setTerm] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [teachingSubjects, setTeachingSubjects] = useState([]);

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleTermChange = (event) => {
    setTerm(event.target.value);
  };

  const handleStreamChange = (event) => {
    setSelectedStream(event.target.value);
  };

  const handleUnitChange = (event) => {
    const value = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedUnits(value);
  };

  const handleAddSubjects = () => {
    setTeachingSubjects([...teachingSubjects, { stream: selectedStream, units: selectedUnits }]);
    setSelectedStream("");
    setSelectedUnits([]);
  };

  const handleUpdateSubjects = () => {
    // API call to send teachingSubjects to backend
    fetch('/api/update-subjects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ year, term, teachingSubjects }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      // Handle success response
    })
    .catch((error) => {
      console.error('Error:', error);
      // Handle error response
    });
  };

  return (
    <div className="classes-container">
      <div className="class-form">
        <center>
            <p className="p">Unit Selection</p>
        </center>
        <div className="first-2">
        <div className="form-group">
          <label>Year</label>
          <input className="input" type="number" value={year} onChange={handleYearChange} placeholder="e.g., 2024" />
        </div>
        <div className="form-group">
          <label>Term</label>
          <select className="select" value={term} onChange={handleTermChange}>
            <option value="" disabled>Select Term</option>
            {terms.map((termOption, index) => (
              <option key={index} value={termOption}>
                {termOption}
              </option>
            ))}
          </select>
        </div>
        </div>
        <div className="second-2">
        <div className="form-group">
          <label>Select Stream</label>
          <select className="select" value={selectedStream} onChange={handleStreamChange}>
            <option value="" disabled>Select Stream</option>
            {streams.map((stream, index) => (
              <option key={index} value={stream}>
                {stream}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Select Units</label>
          <select className="select" multiple value={selectedUnits} onChange={handleUnitChange}>
            {units.map((unit, index) => (
              <option key={index} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
        </div>
       <center>
          <button className="btn" onClick={handleAddSubjects}>Add Subjects</button>
        </center>
      </div>
      <div className="subject-table">
        <center>
            <p className="p">Unit Buskect</p>
        </center>
        <table>
          <thead>
            <tr>
              <th>Stream</th>
              <th>Units</th>
            </tr>
          </thead>
          <tbody>
            {teachingSubjects.map((subject, index) => (
              <tr key={index}>
                <td>{subject.stream}</td>
                <td>{subject.units.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <center> 
          <button  className="btn-update" onClick={handleUpdateSubjects}>Update Subjects</button>
        </center>
      </div>
    </div>
  );
};

export default Classes;
