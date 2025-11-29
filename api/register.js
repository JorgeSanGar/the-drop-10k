require('dotenv').config();
const admin = require('firebase-admin');
const brevo = require('@getbrevo/brevo');

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

// Initialize Brevo
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

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

    const { email, password, firstName, lastName, gender, target } = req.body;

    if (!email || !password || !firstName) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const usersRef = db.collection('users');

        // Check if user exists
        const snapshot = await usersRef.where('email', '==', email).get();
        if (!snapshot.empty) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // Generate Unique Bib
        let bib;
        let isUnique = false;
        // Safety break to prevent infinite loops in case of full DB (unlikely for 10k range)
        let attempts = 0;

        while (!isUnique && attempts < 20) {
            bib = Math.floor(Math.random() * 9900) + 100; // Range 100 - 9999
            const bibSnapshot = await usersRef.where('bib', '==', bib).get();
            if (bibSnapshot.empty) {
                isUnique = true;
            }
            attempts++;
        }

        if (!isUnique) {
            return res.status(500).json({ error: 'Failed to assign unique BIB. Please try again.' });
        }

        // Create User Document
        // NOTE: In production, password should be hashed!
        const newUser = {
            email,
            password, // Storing plain text as per MVP requirement "manage in the back"
            firstName,
            lastName,
            gender: gender || 'Unknown',
            target: target || null,
            role: 'user',
            bib: bib, // Assigned Unique Bib
            createdAt: new Date().toISOString()
        };

        await usersRef.add(newUser);

        // Send Welcome Email
        const sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.subject = "THE DROP: ACCESS GRANTED";
        sendSmtpEmail.htmlContent = `
            <h1>WELCOME TO THE SYSTEM, ${firstName ? firstName.toUpperCase() : 'RUNNER'}.</h1>
            <p>Your profile has been created.</p>
            <p><strong>ID:</strong> DROP-${Math.floor(1000 + Math.random() * 9000)}</p>
            <p>Awaiting mission instructions.</p>
        `;
        sendSmtpEmail.sender = { "name": "THE DROP 10K", "email": "no-reply@thedrop10k.com" };
        sendSmtpEmail.to = [{ "email": email }];

        await apiInstance.sendTransacEmail(sendSmtpEmail);

        // Return user data (excluding password)
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({ message: 'User created', user: userWithoutPassword });

    } catch (error) {
        console.error('Error in /api/register:', error);
        res.status(500).json({ error: 'Internal Server Error: ' + error.message });
    }
};
