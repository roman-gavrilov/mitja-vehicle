import { pusherServer } from '@/lib/pusher';
import jwt from 'jsonwebtoken';
import { findUserByEmail } from '../../../../../models/user';
import { NextResponse } from 'next/server';

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

    // Find user
    const user = await findUserByEmail(decodedToken.email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get socketId from request
    const { socket_id } = await request.json();

    // Generate auth response for Pusher
    const authResponse = pusherServer.authorizeChannel(socket_id, 'presence-chat', {
      user_id: user._id.toString(),
      user_info: {
        id: user._id.toString(),
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        companyName: user.companyDetails?.companyName
      }
    });

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error('Error in Pusher auth:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}