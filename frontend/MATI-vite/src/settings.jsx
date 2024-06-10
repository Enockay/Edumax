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
  const [adminProfile, setAdminProfile] = useState({ name: "", email: "" }); // For admin profile
  const [currentSettings, setCurrentSettings] = useState(null); // For displaying current settings
  const [selectedCategory, setSelectedCategory] = useState("general"); // For selected settings category

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
        setCurrentSettings(data); // Set current settings
      })
      .catch(error => console.error('Error fetching settings:', error));

    // Fetch admin profile data from server
    fetch("https://edumax.fly.dev/admin/profile")
      .then(response => response.json())
      .then(data => {
        setAdminProfile(data);
      })
      .catch(error => console.error('Error fetching admin profile:', error));
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
      setCurrentSettings(settingsData); // Update current settings
    })
    .catch((error) => {
      console.error('Error updating settings:', error);
      setLoading(false); // Hide spinner
    });
  };

  const renderSettingsForm = () => {
    switch (selectedCategory) {
      case "general":
        return (
          <div>
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
          </div>
        );
      case "academic":
        return (
          <div>
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
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="settings-container">
      <h2>Admin Dashboard</h2>
      <div className="cards-container">
        <div className="card">
          <h4>System Information</h4>
          <p>Welcome to EduMax School Management System.</p>
          <p>Manage all school settings and preferences here.</p>
        </div>

        <div className="card">
          <h4>Admin Profile</h4>
          <p>Name: {adminProfile.name}</p>
          <p>Email: {adminProfile.email}</p>
        </div>

        <div className="card">
          <h4>Current School Settings</h4>
          {currentSettings ? (
            <div>
              <p><strong>School Name:</strong> {currentSettings.schoolName}</p>
              <p><strong>Address:</strong> {currentSettings.address}</p>
              <p><strong>Contact:</strong> {currentSettings.contact}</p>
              <p><strong>Academic Year:</strong> {currentSettings.academicYear}</p>
              <p><strong>Term 1 Dates:</strong> {currentSettings.termDates.term1}</p>
              <p><strong>Term 2 Dates:</strong> {currentSettings.termDates.term2}</p>
              <p><strong>Term 3 Dates:</strong> {currentSettings.termDates.term3}</p>
            </div>
          ) : (
            <p>Loading current settings...</p>
          )}
        </div>

        <div className="card">
          <h4>Update School Settings</h4>
          <div className="form-group">
            <label>Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="general">General</option>
              <option value="academic">Academic</option>
            </select>
          </div>
          {renderSettingsForm()}
          {error && <p className="error">{error}</p>}
          <button onClick={handleSaveSettings}>Save Settings</button>
          {loading && <div className="spinner"></div>}
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
