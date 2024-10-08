import jwt from 'jsonwebtoken';
import clientPromise from '../../../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req, { params }) {
  try {
    // Get the token from the cookies
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Decode the token to get the userId
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Connect to the MongoDB database
    const client = await clientPromise;
    const db = client.db();

    // Get user information from the database
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    const customerId = user.customerId;

    // Get the car ID from the route parameters
    const carId = params.id;

    console.log(carId);

    // Query the 'salelists' collection for the specific car
    const car = await db.collection('salelists').findOne({
      _id: new ObjectId(carId),
      customerId: customerId
    });

    if (!car) {
      return new Response(JSON.stringify({ error: 'Car not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, car: car }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error retrieving car from MongoDB:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}