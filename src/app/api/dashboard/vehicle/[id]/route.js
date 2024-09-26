import { NextResponse } from 'next/server';
import clientPromise from '../../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  const id = params.id;

  try {
    const client = await clientPromise;
    const db = client.db(); // Replace with your database name
    const collection = db.collection('vehicles'); // Replace with your collection name

    // Query the database to find the vehicle by its ID
    const vehicle = await collection.findOne({ _id: new ObjectId(id) });

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}