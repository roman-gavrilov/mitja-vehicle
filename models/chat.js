import clientPromise from '../lib/mongodb';

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
            isOnline: 1
        })
        .toArray();

    return users.map(user => ({
        id: user._id.toString(),
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        companyName: user.companyDetails?.companyName,
        isOnline: user.isOnline || false
    }));
}

export async function updateUserOnlineStatus(userId, isOnline) {
    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('users').findOneAndUpdate(
        { _id: userId },
        { $set: { isOnline } },
        { returnDocument: 'after' }
    );

    return result;
}

export async function saveMessage(message) {
    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('messages').insertOne({
        ...message,
        createdAt: new Date()
    });

    return result;
}

export async function getMessageHistory(userId1, userId2) {
    const client = await clientPromise;
    const db = client.db();

    const messages = await db.collection('messages')
        .find({
            $or: [
                { senderId: userId1, receiverId: userId2 },
                { senderId: userId2, receiverId: userId1 }
            ]
        })
        .sort({ createdAt: 1 })
        .toArray();

    return messages;
}