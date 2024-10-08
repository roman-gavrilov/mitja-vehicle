'use client';

import Image from 'next/image';
import { useState } from 'react';
import CustomSvg from '@/app/components/CustomSvg';

const Header = ({ fullname, toggleSidebar }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const initials = fullname
    ? fullname.split(" ").map((name) => name[0]).join("")
    : '';

  return (
    <header className="bg-white shadow-md z-[11]">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2 relative">
          <button
            className="absolute left-0 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 md:hidden"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
          >
            <CustomSvg name="menu" className="h-8 w-8" />
          </button>
          <div className="flex-1 flex justify-center md:justify-start">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={40}
              height={40}
              priority
            />
          </div>
          <div className="relative">
            <button
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold uppercase">
                {initials}
              </div>
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                <a href="/api/auth/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;