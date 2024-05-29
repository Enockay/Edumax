import React, { useState, useEffect } from "react";
import "./css/AssUnits.css";

const AssUnits = () => {
  const [assignedUnits, setAssignedUnits] = useState([]);
  const [year, setYear] = useState("");
  const [term, setTerm] = useState("");

  useEffect(() => {
    // Fetch assigned units from the backend
    fetch('/api/assigned-units')
      .then(response => response.json())
      .then(data => {
        setAssignedUnits(data.units);
        setYear(data.year);
        setTerm(data.term);
      })
      .catch(error => {
        console.error('Error fetching assigned units:', error);
      });
  }, []);

  return (
    <div className="ass-units-container">
      <center>
        <p className="header">Your Selected Units</p>
      </center>
      <div className="units-header">
        <span>Year: {year || "N/A"}</span>
        <span>Term: {term || "N/A"}</span>
        <span>Stream: {assignedUnits.length > 0 ? assignedUnits[0].stream : "N/A"}</span>
      </div>
      <div className="units-grid">
        {assignedUnits.length > 0 ? (
          assignedUnits.map((unit, index) => (
            <div key={index} className="unit-card">
              <p>{unit.name}</p>
            </div>
          ))
        ) : (
          <div className="no-units">
            <p>No units selected. Please go to the classes and select units.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssUnits;
