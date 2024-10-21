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

export async function PUT(req, { params }) {
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

    // Get the updated car data from the request body
    const updatedCarData = await req.json();

    // Remove the _id field from the updatedCarData if it exists
    delete updatedCarData._id;
    delete updatedCarData.imagesbase;

    // Update the car in the 'salelists' collection
    const result = await db.collection('salelists').updateOne(
      { _id: new ObjectId(carId), customerId: customerId },
      { $set: updatedCarData }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: 'Car not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, message: 'Car updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating car in MongoDB:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req, { params }) {
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

    // Find the car in the 'salelists' collection
    const car = await db.collection('salelists').findOne({
      _id: new ObjectId(carId),
      customerId: customerId
    });

    if (!car) {
      return new Response(JSON.stringify({ error: 'Car not found or not authorized to delete' }), { status: 404 });
    }

    // Delete the car from Shopify
    const shopifyProductId = car.shopifyproduct.id;
    const shopifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/shopify?productid=${shopifyProductId}`, {
      method: 'DELETE',
    });

    if (!shopifyResponse.ok) {
      throw new Error('Failed to delete product from Shopify');
    }

    // Delete the car from the 'salelists' collection
    const result = await db.collection('salelists').deleteOne({
      _id: new ObjectId(carId),
      customerId: customerId
    });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: 'Failed to delete car from database' }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, message: 'Car deleted successfully from both Shopify and database' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting car:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}