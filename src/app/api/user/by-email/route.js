import { findUserByEmail } from '../../../../../models/user';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return only the necessary user data
    return NextResponse.json({
      id: user._id,
      email: user.email,
    });
  } catch (error) {
    console.error('Error finding user by email:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}