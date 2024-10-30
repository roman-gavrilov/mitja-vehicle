'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@/app/contexts/UserContext';
import { useChatSocket } from './ChatSocket';
import UserList from './UserList';

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { user } = useUser();
  const messagesEndRef = useRef(null);

  // Initialize chat socket with current user's ID
  const { sendPrivateMessage, subscribeToMessages, subscribeToUserStatus } = useChatSocket(user?.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Subscribe to messages and user status updates
  useEffect(() => {
    if (user?.id) {
      const handleMessage = (data) => {
        setMessages(prev => ({
          ...prev,
          [data.from]: [...(prev[data.from] || []), {
            id: Date.now(),
            senderId: data.from,
            text: data.message,
            timestamp: new Date().toISOString()
          }]
        }));
      };

      const handleUserOnline = (userId) => {
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, isOnline: true } : u
        ));
      };

      const handleUserOffline = (userId) => {
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, isOnline: false } : u
        ));
      };

      subscribeToMessages(handleMessage);
      subscribeToUserStatus(handleUserOnline, handleUserOffline);
    }
  }, [user?.id, subscribeToMessages, subscribeToUserStatus]);

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
        } catch (error) {
          console.error('Error fetching message history:', error);
        }
      }
    };

    fetchMessageHistory();
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
      // Send message to API
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) throw new Error('Failed to save message');

      // Send message through WebSocket
      await sendPrivateMessage(selectedUser.id, newMessage);

      // Update local messages state
      setMessages(prev => ({
        ...prev,
        [selectedUser.id]: [...(prev[selectedUser.id] || []), message]
      }));
      setNewMessage('');
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
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-[800px] h-[600px] bg-white rounded-lg shadow-xl flex flex-col">
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

      <div className="flex-1 flex">
        {/* Users List */}
        <div className="w-1/3 border-r">
          <UserList 
            users={users.filter(u => u.id !== user.id)} 
            onSelectUser={handleSelectUser}
            selectedUser={selectedUser}
          />
        </div>

        {/* Chat Area */}
        <div className="w-2/3 flex flex-col">
          {selectedUser ? (
            <>
              {/* Selected User Header */}
              <div className="p-3 bg-gray-50 border-b">
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
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
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
                </div>
              </form>
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