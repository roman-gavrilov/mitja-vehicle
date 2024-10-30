import { Server } from 'socket.io';
import { updateUserOnlineStatus } from '../../models/chat';

const createSocketServer = (server) => {
  const io = new Server(server, {
    path: '/api/socket',
    transports: ['websocket'],
    upgrade: false,
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  // Store connected users
  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle user joining with their ID
    socket.on('user:join', async (userId) => {
      socket.userId = userId;
      connectedUsers.set(userId, socket.id);
      
      // Update user's online status in database
      await updateUserOnlineStatus(userId, true);
      
      socket.broadcast.emit('user:online', userId);
      console.log(`User ${userId} joined`);
    });

    // Handle private messages
    socket.on('private:message', async (data) => {
      const { to, message } = data;
      const receiverSocketId = connectedUsers.get(to);

      if (receiverSocketId) {
        // Send to specific user
        io.to(receiverSocketId).emit('private:message', {
          from: socket.userId,
          message
        });
        console.log(`Message sent from ${socket.userId} to ${to}`);
      }
    });

    // Handle user disconnection
    socket.on('disconnect', async () => {
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
        
        // Update user's online status in database
        await updateUserOnlineStatus(socket.userId, false);
        
        socket.broadcast.emit('user:offline', socket.userId);
        console.log(`User ${socket.userId} disconnected`);
      }
    });
  });

  return io;
};

export default createSocketServer;