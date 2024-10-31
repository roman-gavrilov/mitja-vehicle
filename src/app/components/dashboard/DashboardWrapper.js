'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from './header';
import Sidebar from './sidebar';
import Breadcrumb from './Breadcrumb';
import Chat from '../chat/Chat';
import { useUser } from '@/app/contexts/UserContext';
import { pusherClient } from '@/lib/pusher';

const DEFAULT_ANNOUNCEMENT = 'You can add only one vehicle on your account.';

const DashboardWrapper = ({ children }) => {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarHidden, setIsSidebarHidden] = useState(true);
  const [announcement, setAnnouncement] = useState(DEFAULT_ANNOUNCEMENT);
  const [isTextFading, setIsTextFading] = useState(false);
  const [currentSenderId, setCurrentSenderId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const { user } = useUser();

  const isDirectSalePage = pathname === '/dashboard/direct-sale/lists';

  // Reset to default announcement when leaving direct-sale/lists page
  useEffect(() => {
    if (!isDirectSalePage) {
      setAnnouncement(DEFAULT_ANNOUNCEMENT);
      setCurrentSenderId(null);
    }
  }, [isDirectSalePage]);

  useEffect(() => {
    if (user?.role === 'reseller' && isDirectSalePage) {
      // Subscribe to the chat channel
      const channel = pusherClient.subscribe('chat');

      // Listen for new messages
      channel.bind('new-message', message => {
        if (message.receiverId === user.id) {
          const newAnnouncement = `You can add only one vehicle on your account. for example: ${message.text}`;
          
          setIsTextFading(true);
          setCurrentSenderId(message.senderId);
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
    if (!replyText.trim() || !currentSenderId) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: currentSenderId,
          text: replyText,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setReplyText('');
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
          left: 0;
          position: absolute;
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
          color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
      {
        user.role &&
        <div className="w-full bg-black text-white text-xs uppercase py-3 px-2 text-center font-thin tracking-wide">
          <div className="flex items-center justify-center">
            {isDirectSalePage && currentSenderId && (
              <form onSubmit={handleSendReply} className="quick-reply px-3 py-1 mr-4">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="text-xs"
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
        />
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ${
          isMobile ? '' : (isSidebarCollapsed ? 'ml-16' : 'ml-16')
        }`}>
          <Breadcrumb />
          <div className="p-1 md:p-6">
            <div className="container mx-auto max-w-full md:max-w-[1240x] text-mainText">
              {children}
            </div>
          </div>
        </main>
        {/* Chat Component */}
        {user && <Chat onNewMessage={user.role === 'reseller' ? null : undefined} />}
      </div>
    </div>
  );
};

export default DashboardWrapper;