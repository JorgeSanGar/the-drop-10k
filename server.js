require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Firebase Setup
// Check if we have credentials in env or file
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
    ? require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
    : {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined
    };

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase initialized successfully');
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

// Routes
app.post('/api/join', async (req, res) => {
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
            ip: req.ip
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
});

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
