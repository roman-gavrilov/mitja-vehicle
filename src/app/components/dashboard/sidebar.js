'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  Home,
  ShoppingCart,
  House,
  Assignment,
  DirectionsCar,
  LocalOffer,
  Person,
  ExitToApp,
  Close,
  List,
  Add,
  CarRental,
  Group,
  MenuOpen as MenuOpenIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { Tooltip, IconButton } from '@mui/material';

const Sidebar = ({role, isCollapsed, isHidden, toggleSidebar }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState(null);

  const navSections = [
    {
      name: 'General',
      links: [
        { name: 'Overview', href: '/dashboard', icon: Home, roles: ['private', 'reseller'] },
      ],
    },
    {
      name: 'Sales',
      links: [
        { 
          name: 'Sell', 
          href: '/dashboard/direct-sale', 
          icon: ShoppingCart,
          roles: ['private', 'reseller'],
          subItems: [
            { name: 'Create', href: '/dashboard/direct-sale/save', icon: Add, roles: ['private', 'reseller'] },
            { name: 'Lists', href: '/dashboard/direct-sale/lists', icon: List, roles: ['private', 'reseller'] },
          ]
        },
        { name: 'Rent', href: '/dashboard/rent', icon: CarRental, roles: ['reseller'] },
        { name: 'My ads', href: '/dashboard/my-ads', icon: Assignment, roles: ['private', 'reseller'] },
        { name: 'My Vehicles', href: '/dashboard/vehicles', icon: DirectionsCar, roles: ['private', 'reseller'] },
        { name: 'Parched vehicles', href: '/dashboard/parched', icon: LocalOffer, roles: ['private', 'reseller'] },
      ],
    },
    {
      name: 'My Account',
      links: [
        { name: 'My Profile', href: '/dashboard/profile', icon: Person, roles: ['private'] },
        { name: 'Profile', href: '/dashboard/reseller-profile', icon: Group, roles: ['reseller'] },
        { name: 'Logout', href: '/logout', icon: ExitToApp, roles: ['private', 'reseller'] },
      ],
    },
  ];

  const isMenuItemVisible = (item) => {
    return item.roles && item.roles.includes(role);
  };

  const getNavItemClass = (path, isSubItem = false) => 
    `py-3 px-2 cursor-pointer rounded-full hover:bg-gray-200 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} ${pathname === path ? 'bg-[#323232]' : 'bg-white'} ${isSubItem && !isCollapsed ? 'ml-6' : ''}`;

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

  const renderNavItem = (item, isSubItem = false) => {
    if (!isMenuItemVisible(item)) return null;
    
    return (
      <li
        className={getNavItemClass(item.href, isSubItem)}
        onClick={() => handleNavigation(item.href)}
      >
        <item.icon className={`${isSubItem ? 'h-5 w-5' : 'h-6 w-6'} ${pathname === item.href ? 'text-white' : ''}`} />
        {!isCollapsed && (
          <span
            className="block"
            aria-current={pathname === item.href ? 'page' : undefined}
          >
            {item.name}
          </span>
        )}
      </li>
    );
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden ${!isHidden ? 'block' : 'hidden'}`} 
        onClick={toggleSidebar}
      ></div>
      <aside className={`p4-4 fixed inset-y-0 left-0 md:left-[30px] z-30 ${isCollapsed ? 'w-12' : 'w-64'} text-black transform transition-all duration-300 ease-in-out md:relative md:z-[49] ${isHidden ? '-translate-x-full' : 'translate-x-0'}`}>
        <div className={`flex justify-between items-center p-4 ${isCollapsed ? 'hidden' : 'md:hidden'}`}>
          <h2 className="text-xl font-bold">Menu</h2>
          <button onClick={toggleSidebar} className="text-black focus:outline-none">
            <Close className="h-6 w-6" />
          </button>
        </div>
        <nav>
          <ul>
            {/* <li className="mb-10 flex justify-center rounded-full">
              <IconButton
                color="inherit"
                aria-label="toggle sidebar"
                onClick={toggleSidebar}
                className={`${isCollapsed ? 'justify-center' : ''} w-full`}
              >
                {isCollapsed ? <MenuIcon /> : <MenuOpenIcon />}
              </IconButton>
            </li> */}
            {navSections.map((section, index) => {
              const visibleLinks = section.links.filter(isMenuItemVisible);
              if (visibleLinks.length === 0) return null;

              return (
                <div key={section.name}>
                  {visibleLinks.map((link) => (
                    <div 
                      key={link.href}
                      className="relative mb-5"
                      onMouseEnter={() => setHoveredItem(link.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {isCollapsed ? (
                        <Tooltip title={link.name} placement="top" arrow>
                          {renderNavItem(link)}
                        </Tooltip>
                      ) : (
                        renderNavItem(link)
                      )}
                      {link.subItems && (isCollapsed ? hoveredItem === link.name : true) && (
                        <ul className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'absolute top-0 left-full ml-0 bg-white shadow-md rounded-md overflow-hidden' : 'ml-6'}`}>
                          {link.subItems.filter(isMenuItemVisible).map((subItem) => (
                            <div key={subItem.href}>
                              {isCollapsed ? (
                                <Tooltip title={subItem.name} placement="right" arrow>
                                  {renderNavItem(subItem, true)}
                                </Tooltip>
                              ) : (
                                renderNavItem(subItem, true)
                              )}
                            </div>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;