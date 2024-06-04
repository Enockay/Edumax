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
  const [loading, setLoading] = useState(false);  // State for spinner
  const [error, setError] = useState("");  // State for error message

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
    if (!year || !term || !selectedStream || selectedUnits.length === 0) {
      setError("All fields are required");
      return;
    }
    setError("");
    const unitsWithSchema = selectedUnits.map(unit => ({ name: unit }));
    setTeachingSubjects([...teachingSubjects, { stream: selectedStream, units: unitsWithSchema }]);
    setSelectedStream("");
    setSelectedUnits([]);
  };

  const handleUpdateSubjects = () => {
    if (!year || !term || teachingSubjects.length === 0) {
      setError("All fields are required and there must be at least one subject");
      return;
    }
    setError("");
    setLoading(true);  // Show spinner
    const teachingSubjectsWithSchema = teachingSubjects.map(subject => ({
      stream: subject.stream,
      units: subject.units.map(unit => ({ name: unit.name }))
    }));

    const uri = "";
    fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ year, term, teachingSubjects: teachingSubjectsWithSchema }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      setLoading(false);  // Hide spinner
      // Handle success response
    })
    .catch((error) => {
      console.error('Error:', error);
      setLoading(false);  // Hide spinner
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
            <input className="input" type="number" value={year} onChange={handleYearChange} placeholder="e.g., 2024" required />
          </div>
          <div className="form-group">
            <label>Term</label>
            <select className="select" value={term} onChange={handleTermChange} required>
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
            <select className="select" value={selectedStream} onChange={handleStreamChange} required>
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
            <select className="select" multiple value={selectedUnits} onChange={handleUnitChange} required>
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
          {error && <p className="error">{error}</p>}
        </center>
      </div>
      <div className="subject-table">
        <center>
            <p className="p">Unit Basket</p>
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
                <td>{subject.units.map(unit => unit.name).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <center>
          <button className="btn" onClick={handleUpdateSubjects}>Update Subjects</button>
          {loading && <div className="spinner"></div>}  {/* Spinner */}
        </center>
      </div>
    </div>
  );
};

export default Classes;
