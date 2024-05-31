import React, { useState, useEffect } from "react";
import "./css/AssUnits.css";

const AssUnits = () => {
  const [assignedUnits, setAssignedUnits] = useState([]);
  const [year, setYear] = useState("");
  const [term, setTerm] = useState("");

  useEffect(() => {
    // Fetch assigned units from the backend
    const uri = "https://edumax.fly.dev/classes/assigned-units";
    fetch(uri)
      .then(response => response.json())
      .then(data => {
        setAssignedUnits(data.teachingSubjects);
        setYear(data.year);
        setTerm(data.term);
      })
      .catch(error => {
        console.error('Error fetching assigned units:', error);
      });
  }, []);

  const handleDeleteUnit = (stream, unit,unitId) => {
    // Send delete request to backend
    const uri = "https://edumax.fly.dev/classes/delete-unit";
    fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ year, term, stream, unit}),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      // Update the state to reflect the deleted unit
      if (data.success) {
        setAssignedUnits(assignedUnits.map(subject => 
          subject.stream === stream 
            ? { ...subject, units: subject.units.filter(unit => unit._id !== unitId) } 
            : subject
        ));
      }
    })
    .catch(error => {
      console.error('Error deleting unit:', error);
    });
  };

  return (
    <div className="ass-container">
      <center>
        <p className=""style={{fontSize:"1.3rem"}}>Your Selected Units</p>
      </center>
    <div className="ass-units-container">
      
      <table className="units-table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Term</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{year || "N/A"}</td>
            <td>{term || "N/A"}</td>
          </tr>
        </tbody>
      </table>
      <table className="units-table">
        <thead>
          <tr>
            <th>Stream</th>
            <th>Units</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {assignedUnits.length > 0 ? (
            assignedUnits.map((subject, index) => (
              <React.Fragment key={index}>
                {subject.units.map((unit, unitIndex) => (
                  <tr key={unit._id}>
                    {unitIndex === 0 && (
                      <td rowSpan={subject.units.length}>{subject.stream}</td>
                    )}
                    <td>{unit.name}</td>
                    <td>
                      <button onClick={() => handleDeleteUnit(subject.stream, unit.name,unit._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="no-units">
                No units selected. Please go to the classes and select units.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default AssUnits;

