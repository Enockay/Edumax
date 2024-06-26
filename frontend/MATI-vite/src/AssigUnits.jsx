import React, { useState, useEffect } from "react";
import "../css/AssUnits.css";

const AssigUnits = () => {
  const streams = ["Form 4 East", "Form 4 West", "Form 3 East", "Form 3 West", "Form 2 East", "Form 2 West", "Form 1 East", "Form 1 West"];
  const units = ["Math", "Kisw", "Eng", "Chem", "Phy", "Bio", "Cre", "Agri", "Busn", "Hist", "Geog"];
  const terms = ["Term 1", "Term 2", "Term 3"];

  const [year, setYear] = useState("");
  const [term, setTerm] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [teachingSubjects, setTeachingSubjects] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [loading, setLoading] = useState(false); // State for spinner
  const [error, setError] = useState(""); // State for error message
  const [teachers, setTeachers] = useState([]);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    // Fetch teachers from the system
    fetch("https://edumax.fly.dev/staff/fetch")
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setTeachers(data);
      })
      .catch(error => console.error("Error fetching teachers:", error));
  }, []);

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

  const handleTeacherChange = (event) => {
    setSelectedTeacher(event.target.value);
  };

  const handleAddSubjects = () => {
    if (!year || !term || !selectedStream || selectedUnits.length === 0 || !selectedTeacher) {
      setError("All fields are required");
      return;
    }
    setError("");
    const unitsWithSchema = selectedUnits.map(unit => ({ name: unit }));
    setTeachingSubjects([...teachingSubjects, { stream: selectedStream, units: unitsWithSchema }]);
    setSelectedStream("");
    setSelectedUnits([]);
  };

  const handleRemoveSubject = (streamToRemove) => {
    setTeachingSubjects(teachingSubjects.filter(subject => subject.stream !== streamToRemove));
  };

  const handleRemoveUnit = (streamToRemove, unitToRemove) => {
    setTeachingSubjects(teachingSubjects.map(subject => {
      if (subject.stream === streamToRemove) {
        return {
          ...subject,
          units: subject.units.filter(unit => unit.name !== unitToRemove)
        };
      }
      return subject;
    }));
  };

  const handleUpdateSubjects = () => {
    if (!year || !term || teachingSubjects.length === 0 || !selectedTeacher) {
      setError("All fields are required and there must be at least one subject");
      return;
    }
    setError("");
    setLoading(true); // Show spinner
    const teachingSubjectsWithSchema = teachingSubjects.map(subject => ({
      stream: subject.stream,
      units: subject.units.map(unit => ({ name: unit.name }))
    }));

    const uri = "https://edumax.fly.dev/classes/update-subjects";
    fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ year, term, teacherName: selectedTeacher, teachingSubjects: teachingSubjectsWithSchema }),
    })
      .then(response => response.json())
      .then(data => {
        setTeachingSubjects([]);
        setNotification(data.message);
        setLoading(false); // Hide spinner
        // Handle success response
      })
      .catch(error => {
        console.error("Error:", error);
        setLoading(false); // Hide spinner
        // Handle error response
      });
  };

  return (
    <div className="assign-units-container">
      <div className="assign-units-inform">
        <p>Admin Panel: Allocate units to the teacher based on their name. Fill in all fields and use the "Add Subjects" button to add units, then "Update Subjects" to finalize.</p>
        <p>If the teacher's name is not found in the select, the teacher is not in the system yet.</p>
      </div>
      <div className="assign-units-form">
        <center>
          <p className="assign-units-title">Unit Selection</p>
        </center>
        <div className="assign-units-row">
          <div className="assign-units-form-group">
            <label>Year</label>
            <input className="assign-units-input" type="number" value={year} onChange={handleYearChange} placeholder="e.g., 2024" required />
          </div>
          <div className="assign-units-form-group">
            <label>Term</label>
            <select className="assign-units-select" value={term} onChange={handleTermChange} required>
              <option value="" disabled>Select Term</option>
              {terms.map((termOption, index) => (
                <option key={index} value={termOption}>
                  {termOption}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="assign-units-row">
          <div className="assign-units-form-group">
            <label>Teacher's Name</label>
            <select className="assign-units-select" value={selectedTeacher} onChange={handleTeacherChange} required>
              <option value="" disabled>Select Teacher</option>
              {teachers.map((teacher, index) => (
                <option key={index} value={teacher.name}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>
          <div className="assign-units-form-group">
            <label>Select Stream</label>
            <select className="assign-units-select" value={selectedStream} onChange={handleStreamChange} required>
              <option value="" disabled>Select Stream</option>
              {streams.map((stream, index) => (
                <option key={index} value={stream}>
                  {stream}
                </option>
              ))}
            </select>
          </div>
          <div className="assign-units-form-group">
            <label>Select Units</label>
            <select className="assign-units-select" multiple value={selectedUnits} onChange={handleUnitChange} required>
              {units.map((unit, index) => (
                <option key={index} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>
        <center>
          <button className="assign-units-btn" onClick={handleAddSubjects}>Add Subjects</button>
          {error && <p className="assign-units-error">{error}</p>}
        </center>
      </div>
      <div className="assign-units-subject-table">
        <center>
          <p className="assign-units-title">Unit Basket</p>
        </center>
        <table>
          <thead>
            <tr>
              <th>Stream</th>
              <th>Units</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachingSubjects.map((subject, index) => (
              <tr key={index}>
                <td>{subject.stream}</td>
                <td>{subject.units.map(unit => unit.name).join(", ")}</td>
                <td>
                  <button className="assign-units-remove-btn" onClick={() => handleRemoveSubject(subject.stream)}>Remove Stream</button>
                  {subject.units.map(unit => (
                    <button key={unit.name} className="assign-units-remove-btn" onClick={() => handleRemoveUnit(subject.stream, unit.name)}>Remove {unit.name}</button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <center>
          <button className="assign-units-btn" onClick={handleUpdateSubjects}>Update Subjects</button>
          {loading && <div className="assign-units-spinner"></div>} {/* Spinner */}
        </center>
      </div>
      <center>
        {notification && <div className="assign-units-notification">{notification}</div>}
      </center>
    </div>
  );
};

export default AssigUnits;
