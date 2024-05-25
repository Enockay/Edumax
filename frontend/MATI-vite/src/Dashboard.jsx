import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/Dashboard.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Body from "./Body";
import Footer from "./Footer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // Simulate authentication check
  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem('authToken'); // Check for an auth token
    if (!isAuthenticated) {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [navigate]);

  const handleItemOnClick = (item) => {
    setSelectedItem(item);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <div className="">
        <Header />
      </div>
      <div className="Body">
        <div className="Sidebar">
          <button className="toggle-button" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={collapsed ? faBars : faTimes} />
          </button>
          <Sidebar onItemClick={handleItemOnClick} collapsed={collapsed} />
        </div>
        <div className="body">
          <Body selectedItem={selectedItem} />
        </div>
      </div>
      <div className="Footer">
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
