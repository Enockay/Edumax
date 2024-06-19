import React from 'react';

interface HeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, toggleSidebar }) => {
  return (
    <header className="bg-green-700 text-white p-4 shadow-md flex justify-between items-center">
      <h1 className="text-2xl hidden md:block">ParentsPortal</h1>
      <button onClick={toggleSidebar} className="md:hidden p-2 bg-gray-700 rounded">
        {sidebarOpen ? 'C-Menu' : 'O-Menu'}
      </button>
      <div className="flex items-center">
        <span className="mr-4">User</span>
        <div className="rounded-full bg-white text-blue-600 w-8 h-8 flex items-center justify-center">EM</div>
      </div>
    </header>
  );
};

export default Header;
