import { Server } from 'socket.io';
import createSocketServer from '@/socket/socketServer';

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log('Socket server already running');
    res.end();
    return;
  }

  console.log('Starting socket server...');
  const io = createSocketServer(res.socket.server);
  res.socket.server.io = io;

  console.log('Socket server initialized');
  res.end();
}