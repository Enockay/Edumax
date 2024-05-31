import React, { useState } from "react";
import "./css/Header.css";
import teacher from './assets/teachers.webp';
import profile from './assets/profile.png';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [menu, setMenu] = useState('');
  const [menuItems] = useState(["Marks", "Units", "Students", "Classes"]);

  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.setItem('isLoggedIn', false);
    navigate('/');
};

 
 function getUserInfo() {
  const token = localStorage.getItem('token');
  if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken; // { id, name, email, gender }
  }
  return null;
}

const getUserData = getUserInfo();

const genderextract = () => {
  return getUserData.gender === "male" ? "Mr." : "Madam.";
};

  return (
    <div className="heading">
      <div className="logo">
        <img src={teacher} alt="logo" className="logo-image" />
        <p className="portal-title">TEACHERS PORTAL</p>
      </div>
      <div className="menu-search">
        <select
          id="menu-select"
          value={menu}
          onChange={(e) => setMenu(e.target.value)}
          className="menu-select"
        >
          <option value="">--Select Item--</option>
          {menuItems.map((item, index) => (
            <option key={index} value={item}>{item}</option>
          ))}
        </select>
        <button className="search-button">Search</button>
      </div>
      <div className="teacher-info">
        <div className="dropdown">
          <button className="profile-button">
            <img src={profile} alt="profile" className="profile-photo" />
            <span className="teacher-name">{genderextract()}{getUserData.name}</span>
          </button>
          <div className="dropdown-content">
            <a href="#">Profile</a>
            <a href="#" onClick={handleLogout}>Logout</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
