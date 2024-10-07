// File: app/api/auth/google-signup/route.js

import { findUserByEmail, createUser } from '../../../../../../models/user';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET;

async function createShopifyCustomer(fullName, email, password) {
  const [firstName, ...lastNameParts] = fullName.split(' ');
  const lastName = lastNameParts.join(' ');

  const response = await fetch(
    `${SHOPIFY_STORE}admin/api/2023-04/customers.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_TOKEN,
      },
      body: JSON.stringify({
        customer: {
          email: email,
          password: password,
          password_confirmation: password,
          send_email_welcome: false,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    return errorData;
  }

  return response.json();
}

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

    // Create customer in Shopify
    const shopifyCustomer = await createShopifyCustomer(fullName, email, password);

    if (shopifyCustomer.errors) {
      return NextResponse.json(
        {
          message: "User creation failed on Shopify side",
          error: shopifyCustomer.errors,
        },
        { status: 400 }
      );
    }

    // Create user
    const newUser = await createUser({ fullName, email, password, shopify_id: shopifyCustomer.customer.id });

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
