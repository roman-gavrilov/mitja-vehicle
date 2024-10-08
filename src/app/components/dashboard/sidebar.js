'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import Image from 'next/image';
import CustomSvg from '@/app/components/CustomSvg';

const Sidebar = ({ fullname = "John Doe" }) => {
  const pathname = usePathname();
  const router = useRouter();

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
        { name: 'Overview', href: '/dashboard', icon: 'home' },
      ],
    },
    {
      name: 'Sales',
      links: [
        { name: 'Sell', href: '/dashboard/direct-sale', icon: 'sell' },
        { name: 'Rent', href: '/dashboard/rent', icon: 'rent' },
        { name: 'My ads', href: '/dashboard/my-ads', icon: 'ads' },
        { name: 'My Vehicles', href: '/dashboard/vehicles', icon: 'vehicles' },
        { name: 'Parched vehicles', href: '/dashboard/parched', icon: 'parched' },
      ],
    },
    {
      name: 'My Account',
      links: [
        { name: 'My Profile', href: '/dashboard/profile', icon: 'user' },
        { name: 'Logout', href: '/api/auth/logout', icon: 'exit' },
      ],
    },
  ];

  const getNavItemClass = (path) => 
    `p-4 cursor-pointer hover:bg-gray-700 rounded flex items-center space-x-2 ${pathname === path ? 'bg-gray-900 rounded' : ''}`;

  const handleNavigation = (href) => {
    router.push(href);
  };

  return (
    <aside className="w-64 bg-gray-800 text-white py-2.5 px-5">
      <div className="flex justify-center mb-4">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={50}
          height={50}
          priority
        />
      </div>
      <div className="p-4 border-b border-gray-500">
        <div className="flex items-center space-x-4 border-gray-300">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 text-white text-lg font-semibold">
            {initials}
          </div>
          <div>
            <div className="font-medium text-white text-lg">{fullname}</div>
          </div>
        </div>
      </div>
      <nav>
        <ul>
          {navSections.map((section, index) => (
            <div key={section.name} className={`mt-4 ${index !== navSections.length - 1 ? 'border-b border-gray-500 pb-4 mb-4' : ''}`}>
              {section.links.map((link) => (
                <li key={link.href} className={getNavItemClass(link.href)} onClick={() => handleNavigation(link.href)}>
                  <CustomSvg name={link.icon} className="h-6 w-6" />
                  <span
                    className="block"
                    aria-current={pathname === link.href ? 'page' : undefined}
                  >
                    {link.name}
                  </span>
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