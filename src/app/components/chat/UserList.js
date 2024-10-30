'use client';

import { useState, useEffect } from 'react';

const UserList = ({ users, onSelectUser, selectedUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-2">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => onSelectUser(user)}
            className={`flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-100 transition-colors ${
              selectedUser?.id === user.id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              {user.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">
                {user.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;