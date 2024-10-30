import { Server as ServerIO } from 'socket.io';
import http from 'http';
import createSocketServer from '@/socket/socketServer';

export const config = {
  api: {
    bodyParser: false,
  },
};

const SocketHandler = async (req, res) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io');

    const httpServer = res.socket.server;
    httpServer.setTimeout(0);  // Disable timeout

    const io = new ServerIO(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
      },
      maxHttpBufferSize: 1e8,
      transports: ['websocket', 'polling'],
      pingTimeout: 60000,
      pingInterval: 25000
    });

    // Set up socket server
    createSocketServer(io);

    res.socket.server.io = io;
  } else {
    console.log('socket.io already running');
  }
  res.end();
};

export default SocketHandler;