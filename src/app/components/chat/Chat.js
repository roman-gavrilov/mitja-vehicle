'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@/app/contexts/UserContext';
import UserList from './UserList';
import { pusherClient } from '@/lib/pusher';

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { user } = useUser();
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Update user status
  const updateUserStatus = async () => {
    try {
      await fetch('/api/chat/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to the shared chat channel
    const channel = pusherClient.subscribe('chat');

    // Listen for new messages
    channel.bind('new-message', message => {
      if (message.senderId === user.id || message.receiverId === user.id) {
        const conversationId = message.senderId === user.id ? message.receiverId : message.senderId;
        setMessages(prev => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), message]
        }));
        scrollToBottom();
      }
    });

    // Listen for user status updates
    channel.bind('user-status', ({ userId, isOnline }) => {
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, isOnline } : u
      ));
    });

    // Set up regular status updates
    updateUserStatus(); // Initial status update
    const statusInterval = setInterval(updateUserStatus, 30000); // Update every 30 seconds

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe('chat');
      clearInterval(statusInterval);
    };
  }, [user?.id]);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/chat/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
    // Set up regular user list updates
    const userListInterval = setInterval(fetchUsers, 60000); // Update user list every minute

    return () => clearInterval(userListInterval);
  }, []);

  // Fetch message history when selecting a user
  useEffect(() => {
    const fetchMessageHistory = async () => {
      if (selectedUser && user?.id) {
        try {
          const response = await fetch(`/api/chat/messages?user1=${user.id}&user2=${selectedUser.id}`);
          if (!response.ok) throw new Error('Failed to fetch message history');
          const data = await response.json();
          setMessages(prev => ({
            ...prev,
            [selectedUser.id]: data
          }));
          scrollToBottom();
        } catch (error) {
          console.error('Error fetching message history:', error);
        }
      }
    };

    if (selectedUser) {
      fetchMessageHistory();
    }
  }, [selectedUser, user?.id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const message = {
      id: Date.now(),
      senderId: user.id,
      receiverId: selectedUser.id,
      text: newMessage,
      timestamp: new Date().toISOString()
    };

    try {
      setNewMessage('');

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSelectUser = (selectedUser) => {
    setSelectedUser(selectedUser);
    if (!messages[selectedUser.id]) {
      setMessages(prev => ({
        ...prev,
        [selectedUser.id]: []
      }));
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-[800px] h-[600px] bg-white rounded-lg shadow-xl flex flex-col z-50">
      {/* Chat Header */}
      <div className="p-4 bg-blue-600 text-white rounded-t-lg flex justify-between items-center">
        <h3 className="font-semibold">Chat with Users</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Users List */}
        <div className="w-1/3 border-r flex flex-col min-h-0">
          <UserList 
            users={users.filter(u => u.id !== user.id)} 
            onSelectUser={handleSelectUser}
            selectedUser={selectedUser}
          />
        </div>

        {/* Chat Area */}
        <div className="w-2/3 flex flex-col min-h-0">
          {selectedUser ? (
            <>
              {/* Selected User Header */}
              <div className="p-3 bg-gray-50 border-b flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{selectedUser.name}</p>
                    <p className="text-xs text-gray-500">
                      {selectedUser.isOnline ? 'Online' : 'Offline'}
                    </p>
                    {selectedUser.companyName && (
                      <p className="text-xs text-gray-500">
                        {selectedUser.companyName}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
                style={{ overflowAnchor: 'none' }}
              >
                {messages[selectedUser.id]?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === user.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderId === user.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className="text-xs opacity-75">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t flex-shrink-0 bg-white">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a user to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;