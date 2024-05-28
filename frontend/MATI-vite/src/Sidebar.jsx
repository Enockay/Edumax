import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faMoneyBillWave,
  faBalanceScale,
  faStream,
  faFileAlt,
  faUserTie,
  faUserGraduate,
  faSchool,
  faUserEdit,
  faFileInvoiceDollar
} from '@fortawesome/free-solid-svg-icons';
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
          <a href="#admit-student" onClick={() => handleClick('admit-student')}>
            <FontAwesomeIcon icon={faUserPlus} />
            <span>Admit Student</span>
          </a>
        </li>
        <li className={selectedItem === 'pay-fees' ? 'active' : ''}>
          <a href="#pay-fees" onClick={() => handleClick('pay-fees')}>
            <FontAwesomeIcon icon={faMoneyBillWave} />
            <span>Pay Fees</span>
          </a>
        </li>
        <li className={selectedItem === 'view-balances' ? 'active' : ''}>
          <a href="#view-balances" onClick={() => handleClick('view-balances')}>
            <FontAwesomeIcon icon={faBalanceScale} />
            <span>View Balances</span>
          </a>
        </li>
        <li className={selectedItem === 'show-stream' ? 'active' : ''}>
          <a href="#show-stream" onClick={() => handleClick('show-stream')}>
            <FontAwesomeIcon icon={faStream} />
            <span>Show Stream</span>
          </a>
        </li>
        <li className={selectedItem === 'Produce-Results' ? 'active' : ''}>
          <a href="#Produce-Results" onClick={() => handleClick('Produce-Results')}>
            <FontAwesomeIcon icon={faFileAlt} />
            <span>ResultGen Pro</span>
          </a>
        </li>
        <li className={selectedItem === 'Add-Teacher' ? 'active' : ''}>
          <a href="#Add-Teacher" onClick={() => handleClick('Add-Teacher')}>
            <FontAwesomeIcon icon={faUserTie} />
            <span>Add Teacher</span>
          </a>
        </li>
        <li className={selectedItem === 'add-student' ? 'active' : ''}>
          <a href="#add-student" onClick={() => handleClick('add-student')}>
            <FontAwesomeIcon icon={faUserGraduate} />
            <span>Add Student</span>
          </a>
        </li>
        <li className={selectedItem === 'school-aggregate' ? 'active' : ''}>
          <a href="#school-aggregate" onClick={() => handleClick('school-aggregate')}>
            <FontAwesomeIcon icon={faSchool} />
            <span>School Aggregate</span>
          </a>
        </li>
        <li className={selectedItem === 'delete-students' ? 'active' : ''}>
          <a href="#delete-students" onClick={() => handleClick('delete-students')}>
            <FontAwesomeIcon icon={faUserEdit} />
            <span>Update Student</span>
          </a>
        </li>
        <li className={selectedItem === 'Fees-info' ? 'active' : ''}>
          <a href="#Fees-info" onClick={() => handleClick('Fees-info')}>
            <FontAwesomeIcon icon={faFileInvoiceDollar} />
            <span>Fees Report</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
