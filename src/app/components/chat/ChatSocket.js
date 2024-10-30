'use client';

import { useEffect, useCallback } from 'react';
import io from 'socket.io-client';

let socket = null;

const initSocket = async () => {
  if (!socket) {
    // Initialize socket connection
    await fetch('/api/socket');
    
    socket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      path: '/api/socket',
      transports: ['websocket'],
      upgrade: false
    });

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }
  return socket;
};

export const useChatSocket = (userId) => {
  useEffect(() => {
    if (userId) {
      initSocket().then(socket => {
        socket.emit('user:join', userId);
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [userId]);

  const sendPrivateMessage = useCallback(async (to, message) => {
    const socketInstance = await initSocket();
    socketInstance.emit('private:message', { to, message });
  }, []);

  const subscribeToMessages = useCallback(async (callback) => {
    const socketInstance = await initSocket();
    socketInstance.off('private:message'); // Remove any existing listeners
    socketInstance.on('private:message', callback);
  }, []);

  const subscribeToUserStatus = useCallback(async (onOnline, onOffline) => {
    const socketInstance = await initSocket();
    socketInstance.off('user:online'); // Remove any existing listeners
    socketInstance.off('user:offline');
    socketInstance.on('user:online', onOnline);
    socketInstance.on('user:offline', onOffline);
  }, []);

  return {
    sendPrivateMessage,
    subscribeToMessages,
    subscribeToUserStatus
  };
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};