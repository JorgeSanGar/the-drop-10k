require('dotenv').config();
const admin = require('firebase-admin');
const { requireAuth } = require('./_lib/session');

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

module.exports = async (req, res) => {
    const origin = req.headers.origin;
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
    }
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const session = requireAuth(req, res);
    if (!session) return; // Response sent by requireAuth

    try {
        const userDoc = await db.collection('users').doc(session.sub).get();

        if (!userDoc.exists) {
            return res.status(401).json({ error: 'User not found' });
        }

        const userData = userDoc.data();
        const { password: _, ...userWithoutPassword } = userData;

        res.status(200).json(userWithoutPassword);

    } catch (error) {
        console.error('Error in /api/me:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
