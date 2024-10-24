import { findUserByEmail } from '../../../../../../models/user';
import { findVehiclesByEmail } from '../../../../../../models/vehicles';
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

    const email = user.email;

    const vehicles = await findVehiclesByEmail(email);

    // Base user data
    const userData = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role || 'private',
      vehicles
    };
    // Add reseller-specific fields if user is a reseller
    if (user.role === 'reseller') {
      Object.assign(userData, {
        companyDetails: {
          companyName: user.companyDetails.companyName || '',
          phone: user.companyDetails.phone || '',
          logo: user.companyDetails.logoUrl || '',
          street: user.companyDetails.street || '',
          zip: user.companyDetails.zip || '',
          city: user.companyDetails.city || '',
          vatNumber: user.companyDetails.vatNumber || '',
          workingHours: user.companyDetails.workingHours || {
            monday: { start: "09:00", end: "17:00", isOpen: true },
            tuesday: { start: "09:00", end: "17:00", isOpen: true },
            wednesday: { start: "09:00", end: "17:00", isOpen: true },
            thursday: { start: "09:00", end: "17:00", isOpen: true },
            friday: { start: "09:00", end: "17:00", isOpen: true },
            saturday: { start: "09:00", end: "17:00", isOpen: false },
            sunday: { start: "09:00", end: "17:00", isOpen: false },
          },
          additionalPhones: user.companyDetails.additionalPhones || [],
          additionalEmails: user.companyDetails.additionalEmails || [],
        },
      });
    }
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}