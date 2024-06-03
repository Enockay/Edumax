import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../src/assets/logo.jpeg';
import profile from '../src/assets/profile.png';
import "../css/Header.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const [elapsedTime, setElapsedTime] = useState('');
  const [adminName, setAdminName] = useState('');
  const [collapsed, setCollapsed] = useState(false);

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

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="header-container">
      <div className="left-section">
        <img src={logo} alt="EduMax Logo" className="logo" />
        <div className="title-section">
          <p className="h3">EduMax Hub</p>
        </div>
      </div>
      <div className="center-section">
         <nav className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/students">Student Marks</Link>
          <Link to="/courses">Results</Link>
          <Link to="/settings">Settings</Link>
        </nav>
       
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
