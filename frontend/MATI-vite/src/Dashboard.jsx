import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/Dashboard.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Body from "./Body";
import Footer from "./Footer";

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

  
  return (
    <div className="dashboard">
      <div className="header">
         <Header/>
      </div>
      <div className={` ${collapsed ? 'collapsed' : ''}`}>
        <Sidebar onItemClick={handleItemOnClick} collapsed={collapsed} />
      </div>
      <div className="main">
        <Body selectedItem={selectedItem} />
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
