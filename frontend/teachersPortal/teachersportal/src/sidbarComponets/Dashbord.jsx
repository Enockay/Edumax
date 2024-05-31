import React, { useState, useEffect } from "react";
import "./css/Dashboard.css";


const MainDashboard = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    username: "",
    gender: "",
    // Add more profile information fields as needed
  });

  const [assignedUnits, setAssignedUnits] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [error, setError] = useState("");

  // Fetch data from backend APIs
  useEffect(() => {
    const username = localStorage.getItem("username");
    const profileEndpoint = `https://edumax.fly.dev/profile/${username}`;
    const unitsEndpoint = "https://edumax.fly.dev/classes/assigned-units";
    const notificationsEndpoint = "https://edumax.fly.dev/notifications";

    // Fetch profile data
    fetch(profileEndpoint)
      .then(response => response.json())
      .then(data => {
        setProfileData(data[0]);
        setLoadingProfile(false);
      })
      .catch(error => {
        console.error("Error fetching profile data:", error);
        setError("Error fetching profile data.");
        setLoadingProfile(false);
      });

    // Fetch assigned units from the backend
    fetch(unitsEndpoint)
      .then(response => response.json())
      .then(data => {
        setAssignedUnits(data.teachingSubjects);
        setLoadingUnits(false);
      })
      .catch(error => {
        console.error("Error fetching assigned units:", error);
        setError("Error fetching assigned units.");
        setLoadingUnits(false);
      });

    // Fetch notifications data
    fetch(notificationsEndpoint)
      .then(response => response.json())
      .then(data => {
        setNotifications(data);
        setLoadingNotifications(false);
      })
      .catch(error => {
        console.error("Error fetching notifications:", error);
        setError("Error fetching notifications.");
        setLoadingNotifications(false);
      });
  }, []);

  const genderextract = () => {
    return profileData.gender === "male" ? "Mr." : "Madam.";
  };

  const DashboardHeader = () => {
    return (
      <h3 className="dashboard-heading">
        {genderextract()} {profileData.name} Dashboard
      </h3>
    );
  };

  return (
    <div className="dashboard">
      <div className="dashboard-items">
      <DashboardHeader />
      
      <div className="card-container">
        <div className="card">
          <h2 className="card-title">Profile Information</h2>
          {loadingProfile ? (
            <div className="spinner"></div>
          ) : (
            <div className="card-content">
              <p className="card-item">Name: <span className="card-value">{profileData.name}</span></p>
              <p className="card-item">Email: <span className="card-value">{profileData.email}</span></p>
              <p className="card-item">Username: <span className="card-value">{profileData.username}</span></p>
              <p className="card-item">Gender: <span className="card-value">{profileData.gender}</span></p>
            </div>
          )}
        </div>
        <div className="card">
          <h2 className="card-title">Classes Assigned</h2>
          {loadingUnits ? (
            <div className="spinner"></div>
          ) : (
            <table className="units-table">
              <thead>
                <tr>
                  <th>Stream</th>
                  <th>Units</th>
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
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="no-units">
                      No units selected. Please go to the classes and select units.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="card">
          <h2 className="card-title">Staff Notifications</h2>
          {loadingNotifications ? (
            <div className="spin"></div>
          ) : (
            notifications.map((notification, index) => (
              <p key={index}>{notification.text}</p>
            ))
          )}
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
    </div> 
  );
};

export default MainDashboard;
