import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaTachometerAlt, FaUser, FaClipboardList,
  FaCalendarCheck, FaSchool, FaEnvelope,
  FaMoneyCheckAlt, FaLifeRing
} from 'react-icons/fa';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`fixed md:min-h:screen md:relative transform ${isOpen ? 'translate-x-0 ' : '-translate-x-full'} md:translate-x-0 w-48 bg-gray-800 text-white p-4 space-y-4 transition-transform duration-200 ease-in-out `}>
      <div className='max-h-screen overflow-auto' >
      <nav>
        <hr className={"m-4"}></hr>
        {/* Academics Section */}
        <div className="mb-4">
          <h5 className="text-md font-semibold mb-2 text-blue-100">Academics</h5>
          <ul>
            <li className="hover:bg-gray-700 p-2 rounded flex items-center">
              <FaClipboardList className="mr-2" />
              <Link to="/Transcripts" onClick={toggleSidebar}>Transcripts</Link>
            </li>
            <li className="hover:bg-gray-700 p-2 rounded flex items-center">
              <FaCalendarCheck className="mr-2" />
              <Link to="/attendance" onClick={toggleSidebar}>Attendance</Link>
            </li>
            <li className="hover:bg-gray-700 p-2 rounded flex items-center">
              <FaSchool className="mr-2" />
              <Link to="/school-events" onClick={toggleSidebar}>School Events</Link>
            </li>
          </ul>
        </div>

        {/* Communication Section */}
        <div className="mb-4">
          <h5 className="text-md font-semibold mb-2 text-blue-100">Communication</h5>
          <ul>
            <li className="hover:bg-gray-700 p-2 rounded flex items-center">
              <FaEnvelope className="mr-2" />
              <Link to="/communication" onClick={toggleSidebar}>Communication</Link>
            </li>
          </ul>
        </div>

        {/* Financial Section */}
        <div className="mb-4">
          <h5 className="text-md font-semibold mb-2 text-blue-100">Financial</h5>
          <ul>
            <li className="hover:bg-gray-700 p-2 rounded flex items-center">
              <FaMoneyCheckAlt className="mr-2" />
              <Link to="/payments" onClick={toggleSidebar}>Payments</Link>
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div className="mb-4">
          <h5 className="text-md font-semibold mb-2 text-blue-100">Support</h5>
          <ul>
            <li className="hover:bg-gray-700 p-2 rounded flex items-center">
              <FaLifeRing className="mr-2" />
              <Link to="/support" onClick={toggleSidebar}>Support</Link>
            </li>
          </ul>
        </div>

        {/* General Section */}
        <div>
          <h5 className="text-md font-semibold mb-2 text-blue-100">General</h5>
          <ul>
            <li className="hover:bg-gray-700 p-2 rounded flex items-center">
              <FaTachometerAlt className="mr-2" />
              <Link to="/parent-dashboard" onClick={toggleSidebar}>Dashboard</Link>
            </li>
            <li className="hover:bg-gray-700 p-2 rounded flex items-center">
              <FaUser className="mr-2" />
              <Link to="/parent-profile" onClick={toggleSidebar}>Profile</Link>
            </li>
          </ul>
        </div>
      </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
