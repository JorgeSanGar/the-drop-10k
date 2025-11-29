require('dotenv').config();
const admin = require('firebase-admin');

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

module.exports = async (req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, ...updates } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Missing email identifier' });
    }

    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', email).get();

        if (snapshot.empty) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Assuming email is unique, get the first doc
        const userDoc = snapshot.docs[0];

        // Update the document
        await userDoc.ref.update(updates);

        // Get updated data
        const updatedSnapshot = await userDoc.ref.get();
        const updatedUser = updatedSnapshot.data();

        // Remove password before sending back
        const { password: _, ...userWithoutPassword } = updatedUser;

        res.status(200).json({ message: 'Profile updated', user: userWithoutPassword });

    } catch (error) {
        console.error('Error in /api/update-profile:', error);
        res.status(500).json({ error: 'Internal Server Error: ' + error.message });
    }
};
