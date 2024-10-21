// File: app/api/auth/user/route.js

import { findUserByEmail } from '../../../../../../models/user';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request) {
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

    // Return user data (excluding sensitive information)
    return NextResponse.json({
      id: user._id,
      email: user.email,
      firstname: user.firstName,
      lastname: user.lastName,
      role: user.role || 'private',
      companyname: user.companyName || '',
      logo: user.logoUrl || '',
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';