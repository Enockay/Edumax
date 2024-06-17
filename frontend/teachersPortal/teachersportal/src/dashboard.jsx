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

const Dashboard = () => {
    const [selectedItem, setSelectedItem] = useState("Dashboard");

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    // Function to render content based on selected item
    const renderContent = () => {
        switch(selectedItem){
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
                return <StudentSearch/>
            case "Attendance" : 
               return <AttendanceSheet/>
            case "View Stream" :
                return <ViewStream/>
            case "Documents" : 
               return <Documents/>
            case "Notifications" :
                return <Notification/>
            case "Calendar":
                return<CalendarComponent/>
            case "Settings":
                return <SettingsProfile/>
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
