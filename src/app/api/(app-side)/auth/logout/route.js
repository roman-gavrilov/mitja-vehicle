// File: app/api/(app-side)/auth/logout/route.js

import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create a response
    const response = NextResponse.json({ message: 'Logout successful' });

    // Clear the token cookie
    response.cookies.set('token', '', { 
      httpOnly: true, 
      expires: new Date(0), 
      path: '/' 
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
