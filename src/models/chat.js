import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function getActiveUsers() {
    const client = await clientPromise;
    const db = client.db();

    const users = await db.collection('users')
        .find({})
        .project({
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            role: 1,
            companyDetails: 1,
            lastSeen: 1
        })
        .toArray();

    return users.map(user => ({
        id: user._id.toString(),
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        companyName: user.companyDetails?.companyName,
        isOnline: user.lastSeen && (new Date() - new Date(user.lastSeen) < 5 * 60 * 1000) // 5 minutes threshold
    }));
}

export async function updateUserOnlineStatus(userId, isOnline) {
    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('users').findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { 
            $set: { 
                lastSeen: isOnline ? new Date() : null
            } 
        },
        { returnDocument: 'after' }
    );

    return result;
}

export async function saveMessage(message) {
    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('messages').insertOne({
        ...message,
        senderId: new ObjectId(message.senderId),
        receiverId: new ObjectId(message.receiverId),
        createdAt: new Date()
    });

    return { ...message, _id: result.insertedId };
}

export async function getMessageHistory(userId1, userId2) {
    const client = await clientPromise;
    const db = client.db();

    const messages = await db.collection('messages')
        .find({
            $or: [
                { 
                    senderId: new ObjectId(userId1), 
                    receiverId: new ObjectId(userId2) 
                },
                { 
                    senderId: new ObjectId(userId2), 
                    receiverId: new ObjectId(userId1) 
                }
            ]
        })
        .sort({ createdAt: 1 })
        .toArray();

    return messages.map(msg => ({
        ...msg,
        id: msg._id.toString(),
        senderId: msg.senderId.toString(),
        receiverId: msg.receiverId.toString()
    }));
}

export async function updateLastSeen(userId) {
    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('users').findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { 
            $set: { 
                lastSeen: new Date() 
            } 
        },
        { returnDocument: 'after' }
    );

    return result;
}