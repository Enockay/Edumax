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
import FileUpload from "./sidbarComponets/uploadExam";
import StudentSearch from "./sidbarComponets/SearchStudent";
import AttendanceSheet from "./sidbarComponets/Attendancs";
import ViewStream from "./sidbarComponets/viewStream"
import Documents from "./sidbarComponets/Docs";
import Notification from "./sidbarComponets/Notification";
import CalendarComponent from "./sidbarComponets/calender";
import SettingsProfile from "./sidbarComponets/Settings";
import SetupAttendance from "./sidbarComponets/setUpAttend";

const Dashboard = () => {
    const [selectedItem, setSelectedItem] = useState("Dashboard");

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    // Function to render content based on selected item
    const renderContent = () => {
        switch (selectedItem) {
            case "Dashboard":
                return <MainDashboard />;
            case "Classes":
                return <Classes />;
            case "Assignments":
                return <Assignment />;
            case "Feed-Student-Marks":
                return <FeedMarks />;
            case "Assigned-Units":
                return <AssUnits />;
            case "Update Student Marks":
                return <UpdateStudentMarks />;
            case "Upload-Exams":
                return <FileUpload />;
            case "Search Student":
                return <StudentSearch />
            case "Attendance":
                return <AttendanceSheet />
            case "View Stream":
                return <ViewStream />
            case "Documents":
                return <Documents />
            case "Notifications":
                return <Notification />
            case "Calendar":
                return <CalendarComponent />
            case "Settings":
                return <SettingsProfile />
            case "Set-Attendance":
                return <SetupAttendance />
            default:
                return <MainDashboard />;
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
                <div className="footer-left" style={{ padding: "15px", backgroundColor: "#f8f9fa", borderTop: "1px solid #e7e7e7", textAlign: "center" }}>
                    <h4 style={{ margin: "0", fontSize: "0.9rem", color: "#343a40" }}>
                        Systems Developed by Blackie-networks
                    </h4>
                    <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#6c757d" }}>
                        © {new Date().getFullYear()} Blackie-networks. All rights reserved.
                    </p>
                    <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#6c757d" }}>
                        Contact: <a href="mailto:support@blackie-networks.com" style={{ color: "#007bff", textDecoration: "none" }}>support@blackie-networks.com</a>
                    </p>
                </div>
        </>
    );
};

export default Dashboard;
