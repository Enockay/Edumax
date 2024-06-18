import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
    faTachometerAlt,
    faClipboardList,
    faGraduationCap,
    faCog,
    faUser,
    faSignOutAlt,
    faChevronDown,
    faChevronUp,
    faUserGraduate,
    faBookOpen,
    faBell,
    faBars,
    faCalendarAlt,
    faFileAlt,
    faLifeRing,
    faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./css/Sidebar.css";

const Sidebar = ({ onItemClick }) => {
    const navigate = useNavigate();

    const [academicsOpen, setAcademicsOpen] = useState(false);
    const [studentsOpen, setStudentsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeItem, setActiveItem] = useState("Dashboard");

    const toggleAcademics = () => setAcademicsOpen(!academicsOpen);
    const toggleStudents = () => setStudentsOpen(!studentsOpen);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleItemClick = (item) => {
        setActiveItem(item);
        onItemClick(item);
        setSidebarOpen(false); // Hide sidebar after item click on small screens
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.setItem("isLoggedIn", false);
        navigate("/");
    };

    return (
        <div className="sidebar-container">
            <button className="sidebar-button" onClick={toggleSidebar} aria-label="Toggle sidebar">
                <FontAwesomeIcon icon={faBars} />
            </button>
            <div className={`sidebar-items ${sidebarOpen ? 'open' : 'closed'}`}>
                <ul>
                    <li className={activeItem === "Dashboard" ? "active" : ""} onClick={() => handleItemClick("Dashboard")}>
                        <FontAwesomeIcon icon={faTachometerAlt} />
                        <span>Dashboard</span>
                    </li>
                    <li className={activeItem === "Assignments" ? "active" : ""} onClick={() => handleItemClick("Assignments")}>
                        <FontAwesomeIcon icon={faClipboardList} />
                        <span>Assignments</span>
                    </li>
                    <li onClick={toggleAcademics} aria-expanded={academicsOpen}>
                        <FontAwesomeIcon icon={faGraduationCap} />
                        <span>Academics</span>
                        <FontAwesomeIcon icon={academicsOpen ? faChevronUp : faChevronDown} className="dropdown-icon" />
                    </li>
                    {academicsOpen && (
                        <ul className="dropdown">
                            <li className={activeItem === "Feed-Student-Marks" ? "active" : ""} onClick={() => handleItemClick("Feed-Student-Marks")}>
                                <FontAwesomeIcon icon={faBookOpen} />
                                <span>Feed Marks</span>
                            </li>
                            <li className={activeItem === "Assigned-Units" ? "active" : ""} onClick={() => handleItemClick("Assigned-Units")}>
                                <FontAwesomeIcon icon={faBookOpen} />
                                <span>Assigned Units</span>
                            </li>
                            <li className={activeItem === "Update Student Marks" ? "active" : ""} onClick={() => handleItemClick("Update Student Marks")}>
                                <FontAwesomeIcon icon={faBookOpen} />
                                <span>Update Marks</span>
                            </li>
                            <li className={activeItem === "Upload-Exams" ? "active" : ""} onClick={() => handleItemClick("Upload-Exams")}>
                                <FontAwesomeIcon icon={faBookOpen} />
                                <span>Upload Exams</span>
                            </li>
                            <hr />
                        </ul>
                    )}
                    <li onClick={toggleStudents} aria-expanded={studentsOpen}>
                        <FontAwesomeIcon icon={faUserGraduate} />
                        <span>Student Center</span>
                    </li>
                        <ul className="dropdown">
                            <li className={activeItem === "View Stream" ? "active" : ""} onClick={() => handleItemClick("View Stream")}>
                                <FontAwesomeIcon icon={faBookOpen} />
                                <span>Documentary</span>
                            </li>
                            <li className={activeItem === "Search Student" ? "active" : ""} onClick={() => handleItemClick("Search Student")}>
                                <FontAwesomeIcon icon={faBookOpen} />
                                <span>Search Student</span>
                            </li>
                            <li className={activeItem === "Set-Attendance" ? "active" : ""} onClick={() => handleItemClick("Set-Attendance")}>
                                <FontAwesomeIcon icon={faUsers} />
                               <span>Set Attendance</span>
                            </li>
                            <li className={activeItem === "Attendance" ? "active" : ""} onClick={() => handleItemClick("Attendance")}>
                                 <FontAwesomeIcon icon={faUsers} />
                               <span>Attendance</span>
                             </li>
                            <hr />
                        </ul>
                    <li className={activeItem === "Documents" ? "active" : ""} onClick={() => handleItemClick("Documents")}>
                        <FontAwesomeIcon icon={faFileAlt} />
                        <span>Documents</span>
                    </li>
                    <li className={activeItem === "Notifications" ? "active" : ""} onClick={() => handleItemClick("Notifications")}>
                        <FontAwesomeIcon icon={faBell} />
                        <span>Notifications</span>
                    </li>
                    <li className={activeItem === "Profile" ? "active" : ""} onClick={() => handleItemClick("Profile")}>
                        <FontAwesomeIcon icon={faUser} />
                        <span>Profile</span>
                    </li>
                    <li className={activeItem === "Settings" ? "active" : ""} onClick={() => handleItemClick("Settings")}>
                        <FontAwesomeIcon icon={faCog} />
                        <span>Settings</span>
                    </li>
                    <li className="logout" onClick={logout}>
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <span>Logout</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

Sidebar.propTypes = {
    onItemClick: PropTypes.func.isRequired,
};

export default Sidebar;
