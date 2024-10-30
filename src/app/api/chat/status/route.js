import { updateLastSeen } from '../../../../models/chat';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
    try {
        // Get the token from the cookies
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify the token
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // Update last seen and get updated user data
        const updatedUser = await updateLastSeen(decodedToken.userId);

        // Trigger Pusher event for user status update
        await pusherServer.trigger('chat', 'user-status', {
            userId: decodedToken.userId,
            isOnline: true
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating user status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}