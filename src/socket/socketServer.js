import { Server } from 'socket.io';

const createSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle user joining with their ID
    socket.on('user:join', (userId) => {
      socket.join(`user:${userId}`);
      socket.broadcast.emit('user:online', userId);
    });

    // Handle private messages
    socket.on('private:message', (data) => {
      const { to, message } = data;
      io.to(`user:${to}`).emit('private:message', {
        from: socket.userId,
        message
      });
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      socket.broadcast.emit('user:offline', socket.userId);
      console.log('A user disconnected');
    });
  });

  return io;
};

export default createSocketServer;