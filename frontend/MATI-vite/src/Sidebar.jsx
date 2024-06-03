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
  faCaretDown,
  faCaretUp,
  faCog,
  faUserCircle,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import '../css/Dashboard.css';

const Sidebar = ({ onItemClick, collapsed }) => {
  const [selectedItem, setSelectedItem] = useState('school-aggregate'); // Default selected item
  const [openDropdowns, setOpenDropdowns] = useState({}); // State to manage open dropdowns

  const handleClick = (item) => {
    setSelectedItem(item);
    onItemClick(item);
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
     <center><h5>SIDEBAR UTILITIES</h5></center> 
     <hr></hr>
      <ul>
        <li className={selectedItem === 'admit-student' ? 'active' : ''}>
          <a href="#admit-student" onClick={() => handleClick('admit-student')}>
            <FontAwesomeIcon icon={faUserPlus} />
            <span>Admit Student</span>
          </a>
        </li>
        <li className={selectedItem === 'add-student' ? 'active' : ''}>
          <a href="#add-student" onClick={() => handleClick('add-student')}>
            <FontAwesomeIcon icon={faUserGraduate} />
            <span>Add Student</span>
          </a>
        </li>
        <li>
          <a onClick={() => toggleDropdown('manage-teachers')}>
            <FontAwesomeIcon icon={faUserEdit} />
            <span>Manage Teachers</span>
            <FontAwesomeIcon icon={openDropdowns['manage-teachers'] ? faCaretUp : faCaretDown} className="caret-icon" />
          </a>
          {openDropdowns['manage-teachers'] && (
            <ul className="dropdown">
              <li className={selectedItem === 'Add-Teacher' ? 'active' : ''}>
                <a href="#Add-Teacher" onClick={() => handleClick('Add-Teacher')}>
                  <FontAwesomeIcon icon={faUserTie} />
                  <span>Add Teacher</span>
                </a>
              </li>
              <li className={selectedItem === 'Assign-units' ? 'active' : ''}>
                <a href="#assign-units" onClick={() => handleClick('Assign-units')}>
                  <FontAwesomeIcon icon={faStream} />
                  <span>Assign Units</span>
                </a>
              </li>
            </ul>
          )}
        </li>
        <li>
          <a onClick={() => toggleDropdown('manage-students')}>
            <FontAwesomeIcon icon={faUserEdit} />
            <span>Manage Students</span>
            <FontAwesomeIcon icon={openDropdowns['manage-students'] ? faCaretUp : faCaretDown} className="caret-icon" />
          </a>
          {openDropdowns['manage-students'] && (
            <ul className="dropdown">
              <li className={selectedItem === 'update-student' ? 'active' : ''}>
                <a href="#update-student" onClick={() => handleClick('update-student')}>
                  <FontAwesomeIcon icon={faUserEdit} />
                  <span>Update Student info</span>
                </a>
              </li>
              <li className={selectedItem === 'show-stream' ? 'active' : ''}>
                <a href="#show-stream" onClick={() => handleClick('show-stream')}>
                  <FontAwesomeIcon icon={faStream} />
                  <span>Show Stream</span>
                </a>
              </li>
            </ul>
          )}
        </li>
        <li>
          <a onClick={() => toggleDropdown('academics')}>
            <FontAwesomeIcon icon={faSchool} />
            <span>Academics</span>
            <FontAwesomeIcon icon={openDropdowns.academics ? faCaretUp : faCaretDown} className="caret-icon" />
          </a>
          {openDropdowns.academics && (
            <ul className="dropdown">
              <li className={selectedItem === 'produce-results' ? 'active' : ''}>
                <a href="#produce-results" onClick={() => handleClick('produce-results')}>
                  <FontAwesomeIcon icon={faFileAlt} />
                  <span>School Results</span>
                </a>
              </li>
              <li className={selectedItem === 'promote-stream' ? 'active' : ''}>
                <a href="#promote-stream" onClick={() => handleClick('promote-stream')}>
                  <FontAwesomeIcon icon={faSchool} />
                  <span>Promote Students</span>
                </a>
              </li>
              <li className={selectedItem === 'algorithm' ? 'active' : ''}>
                <a href="#algorithms" onClick={() => handleClick('algorithm')}>
                  <FontAwesomeIcon icon={faSchool} />
                  <span>School Algorithms</span>
                </a>
              </li>
            </ul>
          )}
        </li>
        <li>
          <a onClick={() => toggleDropdown('finance')}>
            <FontAwesomeIcon icon={faBalanceScale} />
            <span>Finance</span>
            <FontAwesomeIcon icon={openDropdowns.finance ? faCaretUp : faCaretDown} className="caret-icon" />
          </a>
          {openDropdowns.finance && (
            <ul className="dropdown">
              <li className={selectedItem === 'view-balances' ? 'active' : ''}>
                <a href="#view-balances" onClick={() => handleClick('view-balances')}>
                  <FontAwesomeIcon icon={faBalanceScale} />
                  <span>View Balances</span>
                </a>
              </li>
              <li className={selectedItem === 'fees-info' ? 'active' : ''}>
                <a href="#fees-info" onClick={() => handleClick('fees-info')}>
                  <FontAwesomeIcon icon={faBalanceScale} />
                  <span>Fees Report</span>
                </a>
              </li>
              <li className={selectedItem === 'pay-fees' ? 'active' : ''}>
                <a href="#pay-fees" onClick={() => handleClick('pay-fees')}>
                  <FontAwesomeIcon icon={faMoneyBillWave} />
                  <span>Pay Fees</span>
                </a>
              </li>
            </ul>
          )}
        </li>
        <li className={selectedItem === 'school-aggregate' ? 'active' : ''}>
          <a href="#school-aggregate" onClick={() => handleClick('school-aggregate')}>
            <FontAwesomeIcon icon={faSchool} />
            <span>School Aggregate</span>
          </a>
        </li>
        <li>
          <a onClick={() => toggleDropdown('settings')}>
            <FontAwesomeIcon icon={faCog} />
            <span>Settings</span>
            <FontAwesomeIcon icon={openDropdowns.settings ? faCaretUp : faCaretDown} className="caret-icon" />
          </a>
          {openDropdowns.settings && (
            <ul className="dropdown">
              <li className={selectedItem === 'general-settings' ? 'active' : ''}>
                <a href="#general-settings" onClick={() => handleClick('general-settings')}>
                  <FontAwesomeIcon icon={faCog} />
                  <span>General Settings</span>
                </a>
              </li>
              <li className={selectedItem === 'account-settings' ? 'active' : ''}>
                <a href="#account-settings" onClick={() => handleClick('account-settings')}>
                  <FontAwesomeIcon icon={faCog} />
                  <span>Account Settings</span>
                </a>
              </li>
            </ul>
          )}
        </li>
        <li className={selectedItem === 'user-profile' ? 'active' : ''}>
          <a href="#user-profile" onClick={() => handleClick('user-profile')}>
            <FontAwesomeIcon icon={faUserCircle} />
            <span>User Profile</span>
          </a>
        </li>
        <li className={selectedItem === 'logout' ? 'active' : ''}>
          <a href="#logout" onClick={() => handleClick('logout')}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Logout</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
