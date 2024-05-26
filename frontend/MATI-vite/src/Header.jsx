import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../src/assets/logo.jpeg';
import profile from '../src/assets/profile.png';
import "../css/Header.css";

const Header = () => {
  const [elapsedTime, setElapsedTime] = useState('');
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    const storedAdminName = localStorage.getItem('username');
    if (storedAdminName) {
      setAdminName(storedAdminName);
    }

    const loginTime = localStorage.getItem('loginTime');
    if (loginTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const loginDate = new Date(loginTime);
        const diff = now - loginDate;

        const hours = Math.floor(diff / 1000 / 60 / 60);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setElapsedTime(`${hours}h ${minutes}m ${seconds}s`);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="heading">
      <div className="left-section">
        <img src={logo} alt="EduMax Logo" className="logo" />
        <div className="title-section">
          <h3 className="h3" style={{ color: 'white' }}>EduMax Hub</h3>
          <h6 className="h6" style={{ margin: 0, fontStyle: 'italic' }}>Transforming World of Education Through Technology</h6>
        </div>
      </div>
      <div className="center-section">
        <nav className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/students">Student Marks</Link>
          <Link to="/courses">Results</Link>
          <Link to="/settings">Settings</Link>
        </nav>
        <div className="search-bar">
          <input id="input" type="text" placeholder="Search..." />
          <button className="btn" type="submit">Search</button>
        </div>
      </div>
      <div className="right-section">
        <div className="user-profile">
          <img src={profile} alt="User Profile" className="profile-pic" />
          <span className="username">{adminName}</span>
          <h4 className="time">{elapsedTime}</h4>
        </div>
      </div>
    </div>
  );
};

export default Header;
