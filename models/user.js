import clientPromise from '../lib/mongodb';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function findUserByEmail(email) {
  const client = await clientPromise;
  const db = client.db();

  return await db.collection('users').findOne({ email });
}

export async function createUser({ email, password, shopify_id }) {
  const client = await clientPromise;
  const db = client.db();

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate unique customer ID
  const customerId = uuidv4();

  const result = await db.collection('users').insertOne({
    email,
    password: hashedPassword,
    customerId,  // Save the generated customer ID
    createdAt: new Date(), // Add creation date if needed
    shopify_id
  });

  return {
    _id: result.insertedId,
    email,
    shopify_id,
    customerId
  }; // Return the inserted user
}
