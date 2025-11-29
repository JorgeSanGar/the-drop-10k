const admin = require('firebase-admin');
const SibApiV3Sdk = require('sib-api-v3-sdk');

// Firebase Setup
if (!admin.apps.length) {
    try {
        const serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined
        };

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } catch (error) {
        console.error('Firebase initialization error:', error.message);
    }
}

const db = admin.firestore();

// Brevo Setup
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const waitlistRef = db.collection('waitlist');

        // Check for duplicate
        const snapshot = await waitlistRef.where('email', '==', email).get();
        if (!snapshot.empty) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // Save to Firestore
        await waitlistRef.add({
            email,
            date: new Date(),
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
        });

        // Send Email via Brevo
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = "THE DROP: YOU ARE IN [CLASSIFIED]";
        sendSmtpEmail.htmlContent = "<h1>WELCOME OPERATIVE.</h1><p>You have secured your spot in the priority list.</p><p>Stay alert.</p>";
        sendSmtpEmail.sender = { "name": "THE DROP 10K", "email": "no-reply@thedrop10k.com" };
        sendSmtpEmail.to = [{ "email": email }];

        await apiInstance.sendTransacEmail(sendSmtpEmail);

        res.status(201).json({ message: 'Success' });

    } catch (error) {
        console.error('Error in /api/join:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
