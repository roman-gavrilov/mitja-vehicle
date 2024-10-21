import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

const protectedRoutes = [
  { path: '/dashboard/rent', roles: ['reseller'] },
  // Add more protected routes here
];

export async function middleware(request) {
  const token = request.cookies.get('token');
  
  // Check if token exists
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify token using jose library
    const { payload } = await jwtVerify(token.value, new TextEncoder().encode(JWT_SECRET));
    const userRole = payload.role; // Assuming the role is stored in the token payload

    // Check if the current path is a protected route
    const matchedRoute = protectedRoutes.find(route => request.nextUrl.pathname.startsWith(route.path));

    if (matchedRoute && !matchedRoute.roles.includes(userRole)) {
      // If the user doesn't have the required role, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If everything is okay, continue to the page
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
