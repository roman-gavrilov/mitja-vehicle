import clientPromise from '../lib/mongodb';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function findVehiclesByEmail(email) {
  const client = await clientPromise;
  const db = client.db();

  return await db.collection('salelists').find({ userEmail: email }).toArray();
}
