import React, { useState, useEffect } from "react";
import "./css/Dashboard.css";
import {jwtDecode} from "jwt-decode";

const MainDashboard = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    username: "",
    gender: "",
  });

  const [assignedUnits, setAssignedUnits] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      fetchProfileData(username);
      fetchNotifications();
    }
  }, []);

  useEffect(() => {
    if (profileData.name) {
      fetchAssignedUnits(profileData.name);
    }
  }, [profileData.name]);

  const fetchProfileData = async (username) => {
    try {
      const response = await fetch(`https://edumax.fly.dev/profile/${username}`);
      const data = await response.json();
      setProfileData(data[0]);
      setLoadingProfile(false);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setError("Error fetching profile data.");
      setLoadingProfile(false);
    }
  };

  const fetchAssignedUnits = async (name) => {
    try {
      const response = await fetch(`https://edumax.fly.dev/classes/assigned-units/${name}`);
      const data = await response.json();
      setAssignedUnits(data[0].teachingSubjects);
      setLoadingUnits(false);
    } catch (error) {
      console.error("Error fetching assigned units:", error);
      setError("Error fetching assigned units.");
      setLoadingUnits(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch("https://edumax.fly.dev/notifications");
      const data = await response.json();
      setNotifications(data);
      setLoadingNotifications(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Error fetching notifications.");
      setLoadingNotifications(false);
    }
  };

  const genderExtract = () => {
    return profileData.gender === "male" ? "Mr." : "Madam.";
  };

  const DashboardHeader = () => {
    return (
      <h3 className="dashboard-heading">
        {genderExtract()} {profileData.name} Dashboard
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
                    assignedUnits.slice(0, 4).map((subject, index) => (
                      <React.Fragment key={index}>
                        {subject.units.slice(0, 4).map((unit, unitIndex) => (
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
                        <center>No Units Allocated Yet</center>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
            {assignedUnits.length > 4 && (
             <center>
                  <p className="more-units-message">
                more on assigned units
              </p>
             </center> 
            )}
          </div>
          <div className="card">
            <h2 className="card-title">Staff Notifications</h2>
            {loadingNotifications ? (
              <div className="spinner"></div>
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
