import { NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher';
import { saveMessage } from '../../../models/chat';

export async function POST(request) {
  try {
    const message = await request.json();
    
    console.log('Received message:', message);
    
    // Save message to database
    const savedMessage = await saveMessage(message);

    console.log('Saved message:', savedMessage);

    // Create a clean message object
    const messageToSend = {
      id: message.id,
      senderId: message.senderId,
      receiverId: message.receiverId,
      text: message.text,
      timestamp: message.timestamp
    };

    // Log the event we're about to trigger
    console.log('Triggering Pusher event', {
      event: 'new-message',
      channel: 'chat',
      message: messageToSend
    });

    // Send to a single channel that all clients listen to
    await pusherServer.trigger('chat', 'new-message', messageToSend);

    return NextResponse.json(savedMessage);
  } catch (error) {
    console.error('Error in message route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}