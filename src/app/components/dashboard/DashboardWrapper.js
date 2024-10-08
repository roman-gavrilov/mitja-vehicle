'use client';

import { useState, useEffect } from 'react';
import Header from './header';
import Sidebar from './sidebar';
import Breadcrumb from './Breadcrumb';

const DashboardWrapper = ({ children }) => {
  const [fullName, setFullName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      try {
        const response = await fetch(`${baseUrl}/api/auth/user`, {
          cache: 'no-store',
        });
        const data = await response.json();
        setFullName(data.fullName);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header fullname={fullName} toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar fullname={fullName} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          <Breadcrumb />
          <div className="p-4 md:p-6">
            <div className="container mx-auto max-w-full md:max-w-[800px] text-mainText">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardWrapper;