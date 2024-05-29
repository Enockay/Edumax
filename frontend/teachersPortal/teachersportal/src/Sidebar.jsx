import React, { useState } from "react";
import {
    faTachometerAlt,
    faChalkboardTeacher,
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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./css/Sidebar.css";

const Sidebar = ({ onItemClick }) => {
    const [academicsOpen, setAcademicsOpen] = useState(false);
    const [studentsOpen, setStudentsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleAcademics = () => setAcademicsOpen(!academicsOpen);
    const toggleStudents = () => setStudentsOpen(!studentsOpen);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleItemClick = (item) => {
        onItemClick(item);
        setSidebarOpen(false); // Hide sidebar after item click on small screens
    };

    return (
        <div className="items">
            <button className="sidebar-button" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={faBars} />
            </button>
            <div className={`sidebar-items ${sidebarOpen ? 'open' : 'closed'}`}>
                <ul>
                    <li className="active">
                        <FontAwesomeIcon icon={faTachometerAlt} />
                        <span onClick={() => handleItemClick("Dashboard")}>Dashboard</span>
                    </li>
                    <li>
                        <FontAwesomeIcon icon={faChalkboardTeacher} />
                        <span onClick={() => handleItemClick("Classes")}>Classes</span>
                    </li>
                    <li>
                        <FontAwesomeIcon icon={faClipboardList} />
                        <span onClick={() => handleItemClick("Assignments")}>Assignments</span>
                    </li>
                    <li onClick={toggleAcademics}>
                        <FontAwesomeIcon icon={faGraduationCap} />
                        <span>Academics</span>
                        <FontAwesomeIcon icon={academicsOpen ? faChevronUp : faChevronDown} className="dropdown-icon" />
                    </li>
                    {academicsOpen && (
                        <ul className="dropdown">
                            <li>
                                <FontAwesomeIcon icon={faBookOpen} />
                                <span onClick={() => handleItemClick("Feed-Student-Marks")}>Feed Student Marks</span>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faBookOpen} />
                                <span onClick={() => handleItemClick("Assigned-Units")}>Assigned Units</span>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faBookOpen} />
                                <span onClick={() => handleItemClick("Update Student Marks")}>Update Student Marks</span>
                            </li>
                            <hr />
                        </ul>
                    )}
                    <li onClick={toggleStudents}>
                        <FontAwesomeIcon icon={faUserGraduate} />
                        <span>Students</span>
                        <FontAwesomeIcon icon={studentsOpen ? faChevronUp : faChevronDown} className="dropdown-icon" />
                    </li>
                    {studentsOpen && (
                        <ul className="dropdown">
                            <li>
                                <FontAwesomeIcon icon={faBookOpen} />
                                <span onClick={() => handleItemClick("View Stream")}>View Stream</span>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faBookOpen} />
                                <span onClick={() => handleItemClick("Search Student")}>Search Student</span>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faBookOpen} />
                                <span onClick={() => handleItemClick("Other")}>Other</span>
                            </li>
                            <hr />
                        </ul>
                    )}
                    <li>
                        <FontAwesomeIcon icon={faUser} />
                        <span onClick={() => handleItemClick("Profile")}>Profile</span>
                    </li>
                    <li>
                        <FontAwesomeIcon icon={faBell} />
                        <span onClick={() => handleItemClick("Notifications")}>Notifications</span>
                    </li>
                    <li>
                        <FontAwesomeIcon icon={faCog} />
                        <span onClick={() => handleItemClick("Settings")}>Settings</span>
                    </li>
                    <li className="logout">
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <span onClick={() => handleItemClick("Logout")}>Logout</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};


export default Sidebar