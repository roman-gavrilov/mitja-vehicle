'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import CustomSvg from '@/app/components/CustomSvg';

const Sidebar = ({fullname, isOpen, toggleSidebar }) => {
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
        { name: 'Logout', href: '/logout', icon: 'exit' },
      ],
    },
  ];

  const getNavItemClass = (path) => 
    `p-4 cursor-pointer hover:bg-gray-700 rounded flex items-center space-x-2 ${pathname === path ? 'bg-gray-900 rounded' : ''}`;

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        router.push('/login'); // Redirect to login page after successful logout
      } else {
        console.error('Logout failed');
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error('Logout error:', error);
      // You might want to show an error message to the user here
    }
    toggleSidebar();
  };

  const handleNavigation = (href) => {
    if (href === '/logout') {
      handleLogout();
    } else {
      router.push(href);
      toggleSidebar();
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden ${isOpen ? 'block' : 'hidden'}`} 
        onClick={toggleSidebar}
      ></div>
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white py-2.5 px-5 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:z-[49] md:translate-x-0`}>
        <div className="flex justify-between items-center mb-5 md:hidden">
          <h2 className="text-xl font-bold">Menu</h2>
          <button onClick={toggleSidebar} className="text-white focus:outline-none">
            <CustomSvg name="close" className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4 border-b border-gray-500">
          <div className="flex items-center space-x-4 border-gray-300">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 text-white text-lg uppercase font-semibold">
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
    </>
  );
};

export default Sidebar;