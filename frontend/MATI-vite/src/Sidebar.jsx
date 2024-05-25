import React, { useState } from 'react';
import '../css/Dashboard.css';

const Sidebar = ({ onItemClick, collapsed }) => {
    const [selectedItem, setSelectedItem] = useState('school-aggregate'); // Default selected item

    const handleClick = (item) => {
        setSelectedItem(item);
        onItemClick(item);
    };

    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <ul>
                <li className={selectedItem === 'admit-student' ? 'active' : ''}>
                    <a href="#admit-student" onClick={() => handleClick('admit-student')}>Admit Student</a>
                </li>
                <li className={selectedItem === 'pay-fees' ? 'active' : ''}>
                    <a href="#pay-fees" onClick={() => handleClick('pay-fees')}>Pay Fees</a>
                </li>
                <li className={selectedItem === 'view-balances' ? 'active' : ''}>
                    <a href="#view-balances" onClick={() => handleClick('view-balances')}>View Balances</a>
                </li>
                <li className={selectedItem === 'show-stream' ? 'active' : ''}>
                    <a href="#show-stream" onClick={() => handleClick('show-stream')}>Show Stream</a>
                </li>
                <li className={selectedItem === 'add-student' ? 'active' : ''}>
                    <a href="#add-student" onClick={() => handleClick('add-student')}>Add Student</a>
                </li>
                {/**<li className={selectedItem === 'filter-student' ? 'active' : ''}>
                    <a href="#filter-student" onClick={() => handleClick('filter-student')}>Filter Student</a>
                </li>**/}
                <li className={selectedItem === 'school-aggregate' ? 'active' : ''}>
                    <a href="#school-aggregate" onClick={() => handleClick('school-aggregate')}>School Aggregate</a>
                </li>
                <li className={selectedItem === 'delete-students' ? 'active' : ''}>
                    <a href="#delete-students" onClick={() => handleClick('delete-students')}>Update Student</a>
                </li>
                <li className={selectedItem === 'Fees-info' ? 'active' : ''}>
                    <a href="#Fees-info" onClick={() => handleClick('Fees-info')}>Fees Report</a>
                </li>
                <li className={selectedItem === 'Produce-Results' ? 'active' : ''}>
                    <a href="#Produce-Results" onClick={() => handleClick('Produce-Results')}>School Results</a>
                </li>
                <li className={selectedItem === 'Teachers-Marks-Form' ? 'active' : ''}>
                    <a href="#Teachers-Marks-Form" onClick={() => handleClick('Teachers-Marks-Form')}>Update Student Marks</a>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
