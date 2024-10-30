import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

const pusherServer = new PusherServer({
  appId: '1888579',
  key: '3f56bfa7a2b39da85364',
  secret: '0d70a281b041adb52489',
  cluster: 'us3',
  useTLS: true
});

// Enable client-side logging
const pusherClient = new PusherClient('3f56bfa7a2b39da85364', {
  cluster: 'us3',
  forceTLS: true,
  enabledTransports: ['ws', 'wss'],
  channelAuthorization: {
    transport: 'ajax',
    endpoint: '/api/pusher/auth'
  }
});

pusherClient.connection.bind('error', function(err) {
  console.log('Pusher error:', err);
});

pusherClient.connection.bind('connected', function() {
  console.log('Connected to Pusher');
});

export { pusherServer, pusherClient };