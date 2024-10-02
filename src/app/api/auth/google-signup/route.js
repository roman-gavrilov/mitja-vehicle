// File: app/api/auth/google-signup/route.js

import { findUserByEmail, createUser } from '../../../../../models/user';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    const { email, name: fullName } = await request.json();

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const password = email;

    // Create user
    const newUser = await createUser({ fullName, email, password });

     // Automatically log the user in by generating a JWT token
   const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, fullname: newUser.fullName },
      JWT_SECRET,
      { expiresIn: '5h' }
    );

    // Set the token in a cookie and respond
    const response = NextResponse.json({
      message: "User created and logged in successfully"
    });
    response.cookies.set('token', token, { httpOnly: true, maxAge: 60 * 60 * 5 });

    return response;

  } catch (error) {
    console.error('Google signup error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
