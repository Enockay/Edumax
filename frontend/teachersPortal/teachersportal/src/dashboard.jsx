import React, { useState } from "react";
import "./css/dashboard.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MainDashboard from "./sidbarComponets/Dashbord";

const Dashboard = () => {
    const [selectedItem, setSelectedItem] = useState("");

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    // Function to render content based on selected item
    const renderContent = () => {
        switch(selectedItem){
            case "Dashboard":
                return <MainDashboard />;
            // Add cases for other items as needed
            default:
                return null;
        }
    };

    return (
        <>
            <div className="">
                <Header />
            </div>
            <div className="main">
                <div className="">
                    <Sidebar onItemClick={handleItemClick} />
                </div>

                <div className="main-content">
                    {/* Render content based on selected item */}
                    {renderContent()}
                </div>
            </div>
            <center>
                <hr className="footer-hr" style={{ background: "blue" }}></hr>
            </center>
            <div className="footer-left">
                <p>
                    <a href="">Systems Developed by Blackie-networks</a>
                </p>
            </div>
        </>
    );
};

export default Dashboard;
