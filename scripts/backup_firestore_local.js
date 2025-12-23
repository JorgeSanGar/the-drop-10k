const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Initialize Firebase
const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');

if (!admin.apps.length) {
    let serviceAccount;

    if (fs.existsSync(serviceAccountPath)) {
        console.log('Loading credentials from firebase-service-account.json');
        serviceAccount = require(serviceAccountPath);
    } else {
        console.log('Loading credentials from ENV variables');
        serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined
        };
    }

    if (!serviceAccount.project_id && !serviceAccount.projectId) {
        console.error('Error: Missing project_id in credentials.');
        process.exit(1);
    }

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function backupCollection(collectionName, backupDir) {
    console.log(`Backing up collection: ${collectionName}...`);
    const snapshot = await db.collection(collectionName).get();
    const data = [];
    snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
    });

    const filePath = path.join(backupDir, `${collectionName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Saved ${data.length} documents to ${filePath}`);
    return data.length;
}

async function runBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '..', 'backups', `firestore-${timestamp}`);

    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    try {
        const collections = ['users', 'waitlist'];
        const manifest = {
            timestamp: new Date().toISOString(),
            collections: {}
        };

        for (const col of collections) {
            const count = await backupCollection(col, backupDir);
            manifest.collections[col] = count;
        }

        fs.writeFileSync(path.join(backupDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
        console.log('Backup completed successfully.');
        console.log(`Backup location: ${backupDir}`);

        // Verify files exist and have content
        const files = fs.readdirSync(backupDir);
        if (files.length < collections.length + 1) {
            throw new Error('Backup verification failed: Missing files.');
        }

        for (const file of files) {
            const stats = fs.statSync(path.join(backupDir, file));
            if (stats.size === 0) {
                throw new Error(`Backup verification failed: File ${file} is empty.`);
            }
        }
        console.log('Backup verification passed.');

    } catch (error) {
        console.error('Backup failed:', error);
        process.exit(1);
    }
}

runBackup();
