import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import "./css/AssUnits.css";

const AssUnits = () => {
  const [assignedUnits, setAssignedUnits] = useState([]);
  const [year, setYear] = useState("");
  const [term, setTerm] = useState("");
  const [empty, setEmpty] = useState('');

  useEffect(() => {
    const decodeData = () => {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      return decodedToken.name;
    };
    const teacherName = decodeData();

    // Fetch assigned units from the backend
    const uri = `https://edumax.fly.dev/classes/assigned-units/${teacherName}`;
    fetch(uri)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          setAssignedUnits(data[0].teachingSubjects);
          setYear(data[0].year);
          setTerm(data[0].term);
        } else {
          setEmpty("No Units Allocated Yet");
        }
      })
      .catch(error => {
        console.error('Error fetching assigned units:', error);
      });
  }, []);

  const handleDeleteUnit = (stream, unit, unitId) => {
    // Send delete request to backend
    const uri = "https://edumax.fly.dev/classes/delete-unit";
    fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ year, term, stream, unit }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
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
        <p className="title">Allocated Units This Year</p>
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
                        <button className="delete-button" onClick={() => handleDeleteUnit(subject.stream, unit.name, unit._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-units">
                  <center>{empty}</center>
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
