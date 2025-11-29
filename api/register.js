require('dotenv').config();
const admin = require('firebase-admin');
const brevo = require('@getbrevo/brevo');

// Initialize Firebase (if not already initialized)
if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_PRIVATE_KEY || '{}');
    // Fix for Vercel environment variable handling of newlines
    if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

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

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const usersRef = db.collection('users');

        // Check if user exists
        const snapshot = await usersRef.where('email', '==', email).get();
        if (!snapshot.empty) {
            return res.status(409).json({ error: 'Email already registered' });
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
            bib: null, // To be assigned later
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
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
