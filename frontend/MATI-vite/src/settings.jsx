import React, { useState, useEffect } from "react";
import "../css/Settings.css";

const GeneralSettings = () => {
  const [schoolName, setSchoolName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [termDates, setTermDates] = useState({ term1: "", term2: "", term3: "" });
  const [loading, setLoading] = useState(false); // For loading spinner
  const [error, setError] = useState(""); // For error messages

  useEffect(() => {
    // Fetch initial settings data from server
    fetch("https://edumax.fly.dev/settings")
      .then(response => response.json())
      .then(data => {
        setSchoolName(data.schoolName);
        setAddress(data.address);
        setContact(data.contact);
        setAcademicYear(data.academicYear);
        setTermDates(data.termDates);
      })
      .catch(error => console.error('Error fetching settings:', error));
  }, []);

  const handleSaveSettings = () => {
    if (!schoolName || !address || !contact || !academicYear || !termDates.term1 || !termDates.term2 || !termDates.term3) {
      setError("All fields are required");
      return;
    }
    setError("");
    setLoading(true); // Show spinner

    const settingsData = {
      schoolName,
      address,
      contact,
      academicYear,
      termDates
    };

    fetch("https://edumax.fly.dev/settings/update", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settingsData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Settings updated successfully:', data);
      setLoading(false); // Hide spinner
    })
    .catch((error) => {
      console.error('Error updating settings:', error);
      setLoading(false); // Hide spinner
    });
  };

  return (
    <div className="settings-container">
      <h2>General Settings</h2>
      <div className="form-group">
        <label>School Name</label>
        <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Address</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Contact</label>
        <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Academic Year</label>
        <input type="text" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Term 1 Dates</label>
        <input type="text" value={termDates.term1} onChange={(e) => setTermDates({ ...termDates, term1: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Term 2 Dates</label>
        <input type="text" value={termDates.term2} onChange={(e) => setTermDates({ ...termDates, term2: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Term 3 Dates</label>
        <input type="text" value={termDates.term3} onChange={(e) => setTermDates({ ...termDates, term3: e.target.value })} />
      </div>
      {error && <p className="error">{error}</p>}
      <button onClick={handleSaveSettings}>Save Settings</button>
      {loading && <div className="spinner"></div>}
    </div>
  );
};

export default GeneralSettings;
