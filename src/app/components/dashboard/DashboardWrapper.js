'use client';

import { useState, useEffect } from 'react';
import Header from './header';
import Sidebar from './sidebar';
import Breadcrumb from './Breadcrumb';

const DashboardWrapper = ({ children }) => {
  const [user, setUser] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarHidden, setIsSidebarHidden] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/auth/user`, {
          cache: 'no-store',
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarHidden(!isSidebarHidden);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header user={user} toggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} isMobile={isMobile} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          role={user.role}
          isCollapsed={isMobile ? false : isSidebarCollapsed} 
          isHidden={isMobile ? isSidebarHidden : false}
          toggleSidebar={toggleSidebar} 
        />
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ${
          isMobile ? '' : (isSidebarCollapsed ? 'ml-16' : 'ml-16')
        }`}>
          <Breadcrumb />
          <div className="p-1 md:p-6">
            <div className="container mx-auto max-w-full md:max-w-[1240x] text-mainText">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardWrapper;