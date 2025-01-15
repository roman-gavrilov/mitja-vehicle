'use client';

import { useState, useEffect } from 'react';
import Header from './header';
import Sidebar from './sidebar';
import Breadcrumb from './Breadcrumb';
import { useUser } from '@/app/contexts/UserContext';

const DashboardWrapper = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarHidden, setIsSidebarHidden] = useState(true);
  const { user } = useUser();

  useEffect(() => {
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
    <div className="flex flex-col min-h-screen bg-custom-gradient bg-400% animate-bganimation">
      {
        user.role && user.role === 'private' &&
        <div className="w-full bg-black text-white text-xs uppercase py-3 px-2 text-center font-thin tracking-wide">
          You can add only one vehicle on your account.
        </div>
      }
      <Header user={user} />
      <div className="flex flex-1">
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
            <div className="container mx-auto max-w-full md:max-w-[1240x] bg-[#ffffff69] p-8 rounded-[50px] text-mainText">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardWrapper;