// File: lib/mongodb.js

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

let client;
let clientPromise;
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable to preserve value across module reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, don't use a global variable
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
