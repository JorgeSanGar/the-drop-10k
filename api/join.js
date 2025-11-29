const admin = require('firebase-admin');
const brevo = require('@getbrevo/brevo');

// Initialize Firebase (if not already initialized)
if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_PRIVATE_KEY || '{}');
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

    const { email, name, sex } = req.body;

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
            name: name || 'Unknown',
            sex: sex || 'Unknown',
            date: new Date(),
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
        });

        // Send Email via Brevo
        const sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.subject = "THE DROP: YOU ARE IN [CLASSIFIED]";
        sendSmtpEmail.htmlContent = `<h1>WELCOME OPERATIVE ${name ? name.toUpperCase() : ''}.</h1><p>You have secured your spot in the priority list.</p><p>Stay alert.</p>`;
        sendSmtpEmail.sender = { "name": "THE DROP 10K", "email": "no-reply@thedrop10k.com" };
        sendSmtpEmail.to = [{ "email": email }];

        await apiInstance.sendTransacEmail(sendSmtpEmail);

        res.status(201).json({ message: 'Success' });

    } catch (error) {
        console.error('Error in /api/join:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
