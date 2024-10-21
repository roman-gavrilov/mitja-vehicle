import jwt from 'jsonwebtoken';
import clientPromise from '../../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

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

    const productData = await req.json();

    delete productData.imagesbase;

    const result = await db.collection('salelists').insertOne({
      ...productData,
      customerId,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ success: true, id: result.insertedId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error saving to MongoDB:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

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

    // Connect to the MongoDB database
    const client = await clientPromise;
    const db = client.db();

    // Get user information from the database
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    const customerId = user.customerId;

    // Query the 'salelists' collection for documents matching the email
    const salelists = await db.collection('salelists').find({ customerId: customerId }).toArray();

    return new Response(JSON.stringify({ success: true, salelists: salelists }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error retrieving salelists from MongoDB:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}