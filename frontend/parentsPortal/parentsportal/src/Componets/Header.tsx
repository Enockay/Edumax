import React from 'react';

interface HeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  userName: string;
}

const getInitials = (name: string): string => {
  const nameArray = name.trim().split(' ');
  const initials = nameArray.map(word => word[0]).join('');
  return initials.toUpperCase();
};

const Header: React.FC<HeaderProps> = ({ sidebarOpen, toggleSidebar, userName }) => {
  const userInitials = getInitials(userName);

  return (
    <header className="bg-green-700 text-white p-4 shadow-md flex justify-between items-center">
      <h1 className="text-2xl hidden md:block">ParentsPortal</h1>
      <button onClick={toggleSidebar} className="md:hidden p-2 bg-gray-700 rounded">
        {sidebarOpen ? 'Close Menu' : 'Open Menu'}
      </button>
      <div className="flex items-center">
        <span className="mr-4">{userName}</span>
        <div className="rounded-full bg-white text-blue-600 w-8 h-8 flex items-center justify-center">
          {userInitials}
        </div>
      </div>
    </header>
  );
};

export default Header;
