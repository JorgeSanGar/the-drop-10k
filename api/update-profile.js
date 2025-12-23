require('dotenv').config();
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

// Initialize Firebase (if not already initialized)
if (!admin.apps.length) {
    const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined
    };

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const ALLOWED_ORIGINS = [
    'https://thedrop10k.space',
    'https://www.thedrop10k.space',
    'http://localhost:3000'
];

const ALLOW_LIST = [
    "firstName", "lastName", "tShirtSize", "targetPace", "wave"
];

module.exports = async (req, res) => {
    const origin = req.headers.origin;
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
    }
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, currentPassword, ...updates } = req.body;

    if (!email || !currentPassword) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', email).limit(1).get();

        if (snapshot.empty) {
            // Generic error for security
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        if (!userData.password) {
            console.error(`User ${email} has no password hash.`);
            return res.status(500).json({ error: 'Server misconfigured' });
        }

        const isMatch = await bcrypt.compare(currentPassword, userData.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const cleanUpdates = {};
        cleanUpdates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

        // Strict Allowlist & Validation
        for (const key of Object.keys(updates)) {
            if (!ALLOW_LIST.includes(key)) {
                return res.status(400).json({ error: `Invalid field: ${key}` });
            }

            const value = updates[key];

            // Basic Validation
            if (typeof value === 'string') {
                if (value.length > 100) {
                    return res.status(400).json({ error: `Field ${key} too long` });
                }
                cleanUpdates[key] = value;
            } else if (typeof value === 'number') {
                cleanUpdates[key] = value;
            } else {
                return res.status(400).json({ error: `Invalid type for ${key}` });
            }
        }

        if (Object.keys(cleanUpdates).length <= 1) { // Only updatedAt
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        await userDoc.ref.update(cleanUpdates);

        // Return updated user (without password)
        const updatedDoc = await userDoc.ref.get();
        const updatedData = updatedDoc.data();
        const { password: _, ...userWithoutPassword } = updatedData;

        res.status(200).json({ message: 'Profile updated', user: userWithoutPassword });

    } catch (error) {
        console.error('Error in /api/update-profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
