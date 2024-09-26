'use client';

import { usePathname } from 'next/navigation';
import { HomeIcon, TruckIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ fullname = "Johe Doe" }) => {
  const initials = fullname
    .split(" ")
    .map((name) => name[0])
    .join(""); // Get initials

  const pathname = usePathname(); // Get current path

  return (
    <aside className="w-64 bg-gray-800 text-white">
      <div className="p-4 border-b border-gray-300">
        <div className="flex items-center space-x-4 border-gray-300">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 text-white text-lg font-semibold">
            {initials}
          </div>
          <div>
            <div className="font-medium text-white">{fullname}</div>
            {/* Edit Link */}
            <a href="#" className="text-sm text-blue-400 hover:underline block">
              Edit
            </a>
          </div>
        </div>
      </div>

      <nav>
        <ul>
          {/* Dashboard Link */}
          <li
            className={`p-4 hover:bg-gray-700 flex items-center space-x-2 ${
              pathname === '/dashboard' ? 'bg-gray-900' : ''
            }`}
          >
            <HomeIcon className="h-6 w-6" />
            <a href="/dashboard" className="block">
              Overview
            </a>
          </li>

          {/* My Vehicle Link */}
          <li
            className={`p-4 hover:bg-gray-700 flex items-center space-x-2 ${
              pathname === '/dashboard/vehicles' ? 'bg-gray-900' : ''
            }`}
          >
            <TruckIcon className="h-6 w-6" />
            <a href="/dashboard/vehicles" className="block">
              My Vehicle
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;