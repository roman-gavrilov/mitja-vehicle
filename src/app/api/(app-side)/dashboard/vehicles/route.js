import clientPromise from '../../../../../../lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb'; // Import ObjectId from the mongodb package

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    // Get the token from the cookies
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Decode the token to get the userId
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Connect to the database
    const client = await clientPromise;
    const db = client.db();

    // Fetch the user from the database
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // Use customerId to fetch vehicles
    const customerId = user.customerId;

    // Fetch the vehicles for the current user from the database using customerId
    const vehicles = await db.collection('vehicles').find({ customerId }).toArray();

    return new Response(JSON.stringify({ vehicles }), { status: 200 });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
