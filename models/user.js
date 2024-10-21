import clientPromise from '../lib/mongodb';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function findUserByEmail(email) {
  const client = await clientPromise;
  const db = client.db();

  return await db.collection('users').findOne({ email });
}

export async function createUser({ firstName, lastName, email, password, shopify_id }) {
  const client = await clientPromise;
  const db = client.db();

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate unique customer ID
  const customerId = uuidv4();

  const result = await db.collection('users').insertOne({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    customerId,  // Save the generated customer ID
    createdAt: new Date(), // Add creation date if needed
    shopify_id,
    role: "private"
  });

  return {
    _id: result.insertedId,
    email,
    shopify_id,
    customerId,
    firstName,
    lastName,
    role: "private"
  }; // Return the inserted user
}

export async function createReseller({ firstName, lastName, companyName, email, password, phone, role, shopify_id, companyDetails, logoUrl }) {
  const client = await clientPromise;
  const db = client.db();

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate unique customer ID
  const customerId = uuidv4();

  const result = await db.collection('users').insertOne({
    firstName,
    lastName,
    companyName,
    email,
    password: hashedPassword,
    phone,
    role,
    customerId,  // Save the generated customer ID
    createdAt: new Date(), // Add creation date
    shopify_id,
    logoUrl,
    companyDetails: {
      street: companyDetails.street,
      zip: companyDetails.zip,
      city: companyDetails.city,
      vatNumber: companyDetails.vatNumber
    }
  });

  return {
    _id: result.insertedId,
    email,
    shopify_id,
    customerId,
    firstName,
    lastName,
    companyName,
    role,
    logoUrl
  }; // Return the inserted user
}
