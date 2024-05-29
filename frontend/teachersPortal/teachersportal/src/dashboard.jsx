import React, { useState } from "react";
import "./css/dashboard.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MainDashboard from "./sidbarComponets/Dashbord";
import Classes from "./sidbarComponets/Classes";
import Assignment from "./sidbarComponets/Assigment";
import FeedMarks from "./sidbarComponets/FeedMarks";
import AssUnits from "./sidbarComponets/AssUnits";
import UpdateStudentMarks from "./sidbarComponets/UpdateMarks";

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
            case "Classes" :
                return <Classes/>
            case "Assignments":
                return <Assignment/>
            case "Feed-Student-Marks":
                return <FeedMarks/>
            case "Assigned-Units":
                return <AssUnits/>
                case "Update Student Marks":
                return <UpdateStudentMarks/>
            default:
                return <MainDashboard/>
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
