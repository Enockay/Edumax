import React, { ReactNode, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main className={`flex-1 bg-gray-100 p-4 transition-all duration-200 ${sidebarOpen ? 'ml-48' : 'ml-0'}`}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
