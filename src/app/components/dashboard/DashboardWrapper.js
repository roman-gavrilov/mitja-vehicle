'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Header from './header';
import Sidebar from './sidebar';
import Breadcrumb from './Breadcrumb';
import Chat from '../chat/Chat';
import { useUser } from '@/app/contexts/UserContext';
import { pusherClient } from '@/lib/pusher';
import { popularBrands } from "@/app/components/ads/carData";
import { Tooltip } from '@mui/material';

const DEFAULT_ANNOUNCEMENT = 'You can add only one vehicle on your account';
const ADMIN_EMAIL = 'private@gmail.com';

const DashboardWrapper = ({ children }) => {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarHidden, setIsSidebarHidden] = useState(true);
  const [announcement, setAnnouncement] = useState(DEFAULT_ANNOUNCEMENT);
  const [isTextFading, setIsTextFading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [adminId, setAdminId] = useState(null);
  const [messageWords, setMessageWords] = useState([]);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const replyInputRef = useRef(null);
  const { user } = useUser();

  const isDirectSalePage = pathname.includes('/dashboard/direct-sale/update/');

  const handleDropMessages = async () => {
    try {
      const response = await fetch('/api/chat/messages', {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error dropping messages:', error);
    }
  };

  // Fetch admin user id on component mount
  useEffect(() => {
    const fetchAdminId = async () => {
      try {
        const response = await fetch(`/api/user/by-email?email=${ADMIN_EMAIL}`);
        if (response.ok) {
          const data = await response.json();
          setAdminId(data.id);
        }
      } catch (error) {
        console.error('Error fetching admin id:', error);
      }
    };

    fetchAdminId();
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if Ctrl + 1 is pressed and we're on the right page
      if (e.ctrlKey && e.key === '1' && user?.role === 'reseller') {
        e.preventDefault(); // Prevent default browser behavior
        replyInputRef.current?.focus();
      }
      
      // Check if Ctrl + ` is pressed
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault(); // Prevent default browser behavior
        handleDropMessages();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user?.role]);

  // Reset to default announcement when leaving direct-sale/lists page
  useEffect(() => {
    if (!isDirectSalePage) {
      setAnnouncement(DEFAULT_ANNOUNCEMENT);
      setMessageWords([]);
    }
  }, [isDirectSalePage]);

  useEffect(() => {
    if (user?.role === 'reseller' && isDirectSalePage) {
      // Subscribe to the chat channel
      const channel = pusherClient.subscribe('chat');

      // Listen for new messages
      channel.bind('new-message', message => {
        if (message.receiverId === user.id) {
          const newAnnouncement = `You can add only one vehicle on your account.`;
          // Split the message text into words and then group them into pairs
          const words = message.text.split(' ');
          let wordPairs = [];
          for (let i = 0; i < words.length; i += 2) {
            if (i + 1 < words.length) {
              wordPairs.push(`${words[i]} ${words[i + 1]}`);
            } else {
              wordPairs.push(words[i]);
            }
          }

          setMessageWords(wordPairs);
          
          setIsTextFading(true);
          setTimeout(() => {
            setAnnouncement(newAnnouncement);
            setIsTextFading(false);
          }, 300);
        }
      });

      return () => {
        channel.unbind_all();
        pusherClient.unsubscribe('chat');
      };
    }
  }, [user, isDirectSalePage]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !adminId) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: adminId,
          text: replyText,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setReplyText('');
        setAnnouncement(`You can add only one vehicle on your account`);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

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

  const getTooltipText = (index) => {
    if (!messageWords.length) return popularBrands[index].name;
    
    if (index === popularBrands.length - 1) {
      return messageWords.slice(index).join(' ') || popularBrands[index].name;
    }
    
    return messageWords[index] || popularBrands[index].name;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <style jsx global>{`
        .announcement-text {
          transition: opacity 0.3s ease-in-out;
        }
        .text-fading {
          opacity: 0;
        }
        .quick-reply {
          background: rgba(0, 0, 0, 0.8);
          border-radius: 4px;
          margin-right: 10px;
        }
        .quick-reply input {
          background: transparent;
          border: none;
          color: black;
          outline: none;
          width: 200px;
        }
        .quick-reply input::placeholder {
          color: white;
        }
        .shortcut-hint {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 9px;
          color: rgba(255, 255, 255, 0.4);
          pointer-events: none;
        }
        .populartooltip {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .sidebar-hovered .populartooltip {
          opacity: 1;
        }
      `}</style>
      {
        user.role &&
        <div className="w-full bg-black text-white text-xs uppercase py-3 px-2 text-center font-thin tracking-wide">
          <div className="flex items-center justify-center">
            {user.role === 'reseller' && (
              <form onSubmit={handleSendReply} className="quick-reply mr-4 absolute left-0 -top-[500px]">
                <input
                  ref={replyInputRef}
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="text-xs pr-14"
                  placeholder='.'
                />
              </form>
            )}
            <span className={`announcement-text ${isTextFading ? 'text-fading' : ''}`}>
              {announcement}
            </span>
          </div>
        </div>
      }
      <Header user={user} toggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} isMobile={isMobile} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          role={user.role}
          isCollapsed={isMobile ? false : isSidebarCollapsed} 
          isHidden={isMobile ? isSidebarHidden : false}
          toggleSidebar={toggleSidebar}
          onHoverChange={setIsSidebarHovered}
        />
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ${
          isMobile ? '' : (isSidebarCollapsed ? 'ml-16' : 'ml-16')
        }`}>
          <Breadcrumb />
          {user && user.role === 'reseller' && (
            <div className="p-1 md:p-6 relative">
              <div className="container mx-auto max-w-full md:max-w-[1240x] text-mainText">
                {children}
              </div>
              <div className={`grid grid-cols-3 gap-4 mb-6 z-[999] max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative ${isSidebarHovered ? 'sidebar-hovered' : ''}`}>
                {popularBrands.map((popularBrand, index) => (
                  <Tooltip 
                    key={popularBrand.name} 
                    title={getTooltipText(index)}
                    arrow 
                    placement="top"
                    style={{position: "relative", zIndex: "999"}}
                  >
                    <div className="relative">
                      <button
                        className={`border rounded-md p-4 flex items-center w-full justify-center cursor-pointer bg-white transition-colors duration-300`}
                      >
                        <img
                          src={popularBrand.icon}
                          alt={popularBrand.name}
                          className="max-w-[40px] max-h-[40px]"
                        />
                      </button>
                      <p className='absolute bottom-[-15px] populartooltip' style={{fontSize: "12px", color: "#e9eaeb"}}>{getTooltipText(index)}</p>
                    </div>
                  </Tooltip>
                ))}
              </div>
            </div>
          )}
        </main>
        {/* Chat Component */}
        {user && user.role != "reseller" && <Chat onNewMessage={user.role === 'reseller' ? null : undefined} />}
      </div>
    </div>
  );
};

export default DashboardWrapper;