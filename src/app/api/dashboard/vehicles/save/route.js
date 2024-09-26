import jwt from 'jsonwebtoken';
import clientPromise from '../../../../../../lib/mongodb';
import { ObjectId } from 'mongodb'; // Import ObjectId from the mongodb package

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    // Get the token from the cookies
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Decode the token to get the userId
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Get user information from the database
    const client = await clientPromise;
    const db = client.db();

    // Convert userId to ObjectId before querying the database
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    const customerId = user.customerId;

    // Get the vehicle data from the request body
    const vehicleData = await req.json();

    // Insert the vehicle data into the vehicles collection, linking it with the customerId
    const result = await db.collection('vehicles').insertOne({
      ...vehicleData,
      customerId,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ message: 'Vehicle data saved successfully', vehicleId: result.insertedId }), { status: 200 });

  } catch (error) {
    console.error('Error submitting vehicle data:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
