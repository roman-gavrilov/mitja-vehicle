'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import {
  Home,
  ShoppingCart,
  House,
  Assignment,
  DirectionsCar,
  LocalOffer,
  Person,
  ExitToApp,
  Close
} from '@mui/icons-material';

const Sidebar = ({fullname, isCollapsed, isHidden, toggleSidebar }) => {
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
        { name: 'Overview', href: '/dashboard', icon: Home },
      ],
    },
    {
      name: 'Sales',
      links: [
        { name: 'Sell', href: '/dashboard/direct-sale', icon: ShoppingCart },
        { name: 'Rent', href: '/dashboard/rent', icon: House },
        { name: 'My ads', href: '/dashboard/my-ads', icon: Assignment },
        { name: 'My Vehicles', href: '/dashboard/vehicles', icon: DirectionsCar },
        { name: 'Parched vehicles', href: '/dashboard/parched', icon: LocalOffer },
      ],
    },
    {
      name: 'My Account',
      links: [
        { name: 'My Profile', href: '/dashboard/profile', icon: Person },
        { name: 'Logout', href: '/logout', icon: ExitToApp },
      ],
    },
  ];

  const getNavItemClass = (path) => 
    `p-4 cursor-pointer hover:bg-gray-200 rounded flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} ${pathname === path ? 'bg-gray-300 rounded' : ''}`;

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
    toggleSidebar(); // Close sidebar on logout
  };

  const handleNavigation = (href) => {
    if (href === '/logout') {
      handleLogout();
    } else {
      router.push(href);
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden ${!isHidden ? 'block' : 'hidden'}`} 
        onClick={toggleSidebar}
      ></div>
      <aside className={`p4-4 fixed inset-y-0 left-0 z-30 ${isCollapsed ? 'w-16' : 'w-64'} bg-[#f3f4f6] text-black transform transition-all duration-300 ease-in-out md:relative md:z-[49] ${isHidden ? '-translate-x-full' : 'translate-x-0'} border-r border-gray-200`}>
        <div className={`flex justify-between items-center p-4 ${isCollapsed ? 'hidden' : 'md:hidden'}`}>
          <h2 className="text-xl font-bold">Menu</h2>
          <button onClick={toggleSidebar} className="text-black focus:outline-none">
            <Close className="h-6 w-6" />
          </button>
        </div>
        <nav>
          <ul>
            {navSections.map((section, index) => (
              <div key={section.name} className={`${index !== navSections.length - 1 ? 'border-b border-gray-300' : ''}`}>
                {section.links.map((link) => (
                  <li key={link.href} className={getNavItemClass(link.href)} onClick={() => handleNavigation(link.href)} title={isCollapsed ? link.name : undefined}>
                    <link.icon className="h-6 w-6" />
                    {!isCollapsed && (
                      <span
                        className="block"
                        aria-current={pathname === link.href ? 'page' : undefined}
                      >
                        {link.name}
                      </span>
                    )}
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