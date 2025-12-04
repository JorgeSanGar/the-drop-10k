require('dotenv').config();
const express = require('express');
const compression = require('compression'); // <--- AÑADIR AL INICIO
const cors = require('cors');
const admin = require('firebase-admin');
const brevo = require('@getbrevo/brevo');
const path = require('path');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Trust Proxy (Required for Vercel/Heroku/etc to get real IP)
app.set('trust proxy', 1);

// Security Headers (Helmet)
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for now to avoid breaking external scripts (Tailwind, Lucide, Google Fonts)
}));

// Rate Limiting (Global or specific to API)
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again after a minute.'
});

// Apply rate limiting to all requests (or just API if preferred)
app.use(limiter);

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Explicitly serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for the new registration landing page
app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'registro.html'));
});

// ------------------------------------------------
// 1. FIREBASE SETUP
// ------------------------------------------------
let db;
try {
    let serviceAccount;
    try {
        serviceAccount = require('./firebase-service-account.json');
        console.log('✅ Loaded credentials from firebase-service-account.json');
    } catch (e) {
        console.log('⚠️ firebase-service-account.json not found, using environment variables');
        serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined
        };
    }

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('✅ Firebase Connected Successfully');
    }
    db = admin.firestore();
} catch (error) {
    console.error('❌ Firebase Connection Error:', error.message);
    // Mock db for testing if credentials fail (optional, or just exit)
    // process.exit(1); 
}

// ------------------------------------------------
// 2. BREVO (EMAIL) SETUP
// ------------------------------------------------
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

// ------------------------------------------------
// 3. API ROUTES
// ------------------------------------------------

// JOIN WAITLIST
app.post('/api/join', require('./api/join'));

// REGISTER
app.post('/api/register', require('./api/register'));

// LOGIN
app.post('/api/login', require('./api/login'));

// UPDATE PROFILE
app.post('/api/update-profile', require('./api/update-profile'));

// CHALLENGE FRIEND
app.post('/api/challenge', require('./api/challenge'));

// ORACLE AI
app.post('/api/oracle', require('./api/oracle'));

// MANEJO DE ERROR 404 (Añadir justo antes del app.listen)
// Esto asegura que cualquier ruta no definida arriba sirva el 404.html
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// ------------------------------------------------
// 4. START SERVER
// ------------------------------------------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
