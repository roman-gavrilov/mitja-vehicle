// File: middleware.js

import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request) {
  const token = request.cookies.get('token');
  // Check if token exists
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify token using jose library
    const { payload } = await jwtVerify(token.value, new TextEncoder().encode(JWT_SECRET));
    // If token is valid, allow the request to continue
    return NextResponse.next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Protect routes under /dashboard
export const config = {
  matcher: ['/dashboard/:path*'],
};
