import React, { useState, useEffect } from "react";
import "./css/Dashboard.css";

const MainDashboard = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: ""
    // Add more profile information fields as needed
  });

  const [unitsData, setUnitsData] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Fetch data from backend APIs
  useEffect(() => {
    // Sample API endpoints
    const profileEndpoint = "https://api.example.com/profile";
    const unitsEndpoint = "https://api.example.com/units";
    const notificationsEndpoint = "https://api.example.com/notifications";

    // Fetch profile data
    fetch(profileEndpoint)
      .then(response => response.json())
      .then(data => setProfileData(data))
      .catch(error => console.error("Error fetching profile data:", error));

    // Fetch units data
    fetch(unitsEndpoint)
      .then(response => response.json())
      .then(data => setUnitsData(data))
      .catch(error => console.error("Error fetching units data:", error));

    // Fetch notifications data
    fetch(notificationsEndpoint)
      .then(response => response.json())
      .then(data => setNotifications(data))
      .catch(error => console.error("Error fetching notifications:", error));
  }, []);

  return (
    <div className="dashboard">
      <h3>Mr. {profileData.name} Dashboard</h3>
      <div className="card-container">
        <div className="card">
          <h2 className="h2">Profile Information</h2>
          <p>Name: {profileData.name}</p>
          <p>Email: {profileData.email}</p>
        </div>
        <div className="card">
          <h2 className="h2">Classes Assigned</h2>
          {unitsData.map((unit, index) => (
            <p key={index}>{unit.name}</p>
          ))}
        </div>
        <div className="card">
          <h2 className="h2">Staff Notifications</h2>
          {notifications.map((notification, index) => (
            <p key={index}>{notification.text}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
