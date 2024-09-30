'use client';
import { usePathname } from 'next/navigation';
import { HomeIcon, TruckIcon, UserCircleIcon, MegaphoneIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useMemo } from 'react';

const Sidebar = ({ fullname = "John Doe" }) => {
  const pathname = usePathname();

  const initials = useMemo(() => 
    fullname
      .split(" ")
      .map((name) => name[0])
      .join(""), 
    [fullname]
  );

  const navSections = [
    {
      name: 'General',
      links: [
        { name: 'Overview', href: '/dashboard', icon: HomeIcon },
      ],
    },
    {
      name: 'Sales',
      links: [
        { name: 'My Ads', href: '/dashboard/my-ads', icon: MegaphoneIcon }, // Updated to "My Ads"
        { name: 'Direct Sale', href: '/dashboard/direct-sale', icon: ShoppingCartIcon },
      ],
    },
    {
      name: 'My Account',
      links: [
        { name: 'My Vehicles', href: '/dashboard/vehicles', icon: TruckIcon },
        { name: 'My Profile', href: '/dashboard/profile', icon: UserCircleIcon },
      ],
    },
  ];

  const getNavItemClass = (path) => 
    `p-4 hover:bg-gray-700 rounded flex items-center space-x-2 ${pathname === path ? 'bg-gray-900 rounded' : ''}`;

  return (
    <aside className="w-64 bg-gray-800 text-white py-2.5 px-5">
      <div className="p-4 border-b border-gray-500">
        <div className="flex items-center space-x-4 border-gray-300">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 text-white text-lg font-semibold">
            {initials}
          </div>
          <div>
            <div className="font-medium text-white">{fullname}</div>
            <a href="#" className="text-sm text-blue-400 hover:underline block">Edit</a>
          </div>
        </div>
      </div>
      <nav>
        <ul>
          {navSections.map((section, index) => (
            <div key={section.name} className={`mt-4 ${index !== navSections.length - 1 ? 'border-b border-gray-500 pb-4 mb-4' : ''}`}>
              <p className="text-xs uppercase text-gray-500 mb-2">{section.name}</p>
              {section.links.map((link) => (
                <li key={link.href} className={getNavItemClass(link.href)}>
                  <link.icon className="h-6 w-6" />
                  <a href={link.href} className="block" aria-current={pathname === link.href ? 'page' : undefined}>
                    {link.name}
                  </a>
                </li>
              ))}
            </div>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;