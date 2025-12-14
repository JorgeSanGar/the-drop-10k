require('dotenv').config();
const admin = require('firebase-admin');

// ------------------------------------------------
// FIREBASE SETUP (Copied from server.js)
// ------------------------------------------------
let db;
try {
    let serviceAccount;
    try {
        // Try to load from parent directory or current directory depending on where script is run
        // We will assume running from root, so ./firebase-service-account.json
        serviceAccount = require('../firebase-service-account.json');
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
    process.exit(1);
}

// ------------------------------------------------
// DATA TO UPDATE
// ------------------------------------------------
const usersToUpdate = [
    { "nombre": "JUAN LUIS", "email": "juanluat@yahoo.es", "code": "DROP_VIP_1034" },
    { "nombre": "ANA", "email": "ana.blanco1993@gmail.com", "code": "DROP_VIP_1035" },
    { "nombre": "ALFONSO", "email": "alfchulin@hotmail.com", "code": "DROP_VIP_1036" },
    { "nombre": "GABRIEL", "email": "dedompablosanchez@gmail.com", "code": "DROP_VIP_1037" },
    { "nombre": "JULIO", "email": "jdelgadobeotas@gmail.com", "code": "DROP_VIP_1038" },
    { "nombre": "PEDRO LUIS", "email": "pedroencinar@gmail.com", "code": "DROP_VIP_1039" },
    { "nombre": "DIEGO", "email": "dfg1204@gmail.com", "code": "DROP_VIP_1040" },
    { "nombre": "RAMÓN", "email": "ramongtc@hotmail.com", "code": "DROP_VIP_1041" },
    { "nombre": "RUBEN", "email": "ruben.ravila@gmail.com", "code": "DROP_VIP_1042" },
    { "nombre": "MARIA", "email": "mariahm97@me.com", "code": "DROP_VIP_1043" },
    { "nombre": "MARÍA", "email": "mariajimenezamo89@hotmail.com", "code": "DROP_VIP_1044" },
    { "nombre": "DUNA", "email": "dunajimenezgarcia@gmail.com", "code": "DROP_VIP_1045" },
    { "nombre": "OLGA", "email": "olguijueli82@hotmail.com", "code": "DROP_VIP_1046" },
    { "nombre": "CARLOS", "email": "hervijas@yahoo.es", "code": "DROP_VIP_1047" },
    { "nombre": "DAVID", "email": "davort1087@gmail.com", "code": "DROP_VIP_1048" },
    { "nombre": "DUBY", "email": "dubyperaza@gmail.com", "code": "DROP_VIP_1049" },
    { "nombre": "ALBERTO", "email": "alsago13@gmail.com", "code": "DROP_VIP_1050" },
    { "nombre": "JORGE", "email": "jorgesanchez.js876@gmail.com", "code": "DROP_VIP_1051" },
    { "nombre": "REBECA", "email": "rebeca0912@gmail.com", "code": "DROP_VIP_1052" },
    { "nombre": "CRISTINA", "email": "cvj_24@hotmail.com", "code": "DROP_VIP_1053" },
    { "nombre": "CRISTINA", "email": "crisavila10@hotmail.com", "code": "DROP_VIP_1054" },
    { "nombre": "JAIME", "email": "garbyxd@gmail.com", "code": "DROP_VIP_1055" },
    { "nombre": "JESÚS", "email": "jesusgoes@gmail.com", "code": "DROP_VIP_1056" },
    { "nombre": "LUCIA", "email": "lucialojo96@gmail.com", "code": "DROP_VIP_1057" },
    { "nombre": "PABLO", "email": "pablo25dr@gmail.com", "code": "DROP_VIP_1058" }
];

// ------------------------------------------------
// UPDATE LOGIC
// ------------------------------------------------
async function updateReferralCodes() {
    console.log(`🚀 Starting update for ${usersToUpdate.length} users...`);

    let updatedCount = 0;
    let notFoundCount = 0;
    let errorCount = 0;

    const usersRef = db.collection('users');

    for (const userData of usersToUpdate) {
        try {
            // Query for the user by email
            const snapshot = await usersRef.where('email', '==', userData.email).get();

            if (snapshot.empty) {
                console.log(`⚠️ User not found: ${userData.email}`);
                notFoundCount++;
                continue;
            }

            // Update all matching documents (usually should be just one)
            const batch = db.batch();
            snapshot.docs.forEach(doc => {
                const docRef = usersRef.doc(doc.id);
                batch.update(docRef, { referral_code: userData.code });
            });

            await batch.commit();
            console.log(`✅ Updated ${userData.email} with code ${userData.code}`);
            updatedCount++;

        } catch (error) {
            console.error(`❌ Error updating ${userData.email}:`, error.message);
            errorCount++;
        }
    }

    console.log('\n------------------------------------------------');
    console.log('🎉 Update Complete');
    console.log(`✅ Updated: ${updatedCount}`);
    console.log(`⚠️ Not Found: ${notFoundCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log('------------------------------------------------');
    process.exit(0);
}

updateReferralCodes();
