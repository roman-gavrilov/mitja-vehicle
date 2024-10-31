import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

const pusherServer = new PusherServer({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.NEXT_PUBLIC_PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true
});

// Enable client-side logging
const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY, {
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