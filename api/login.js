require('dotenv').config();
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const { signSession } = require('./_lib/session');

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

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and Password are required' });
    }

    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', email).get();

        if (snapshot.empty) {
            // Generic error for security
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create Session
        const payload = {
            sub: userDoc.id,
            email: userData.email,
            role: userData.role || 'user'
        };

        const token = signSession(payload);
        const isProd = process.env.NODE_ENV === 'production';

        // Set Cookie
        const cookieOptions = [
            `drop_session=${token}`,
            'HttpOnly',
            'Path=/',
            'Max-Age=604800', // 7 days
            'SameSite=Lax'
        ];

        if (isProd) {
            cookieOptions.push('Secure');
        }

        res.setHeader('Set-Cookie', cookieOptions.join('; '));

        res.status(200).json({ ok: true });

    } catch (error) {
        console.error('Error in /api/login:', error);
        if (error.message.includes('JWT_SECRET')) {
            return res.status(500).json({ error: 'Server misconfigured' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
