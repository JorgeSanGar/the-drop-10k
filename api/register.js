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
const brevoKey = process.env.BREVO_API_KEY;
if (brevoKey) {
    apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, brevoKey.trim());
}

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

        // Send Welcome Email (Non-blocking / Graceful Failure)
        if (brevoKey) {
            console.log(`[Brevo] Attempting to send email to ${email} with key length: ${brevoKey.length}`);
            try {
                const sendSmtpEmail = new brevo.SendSmtpEmail();
                sendSmtpEmail.subject = "THE DROP: PROFILE ACTIVATED";

                const name = firstName ? firstName.toUpperCase() : 'RUNNER';

                sendSmtpEmail.htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>THE DROP - Profile Initialized</title>
    <style>
        /* Reset básico */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #050505; }
        
        /* Estilos */
        .wrapper { width: 100%; table-layout: fixed; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #050505; }
        .webkit { max-width: 600px; margin: 0 auto; }
        .btn:hover { background-color: #ffffff !important; color: #000000 !important; }
        
        /* Clases de utilidad para el "ID Card" */
        .id-card {
            border: 1px solid #333333;
            background-color: #111111;
            /* Simulamos sombra con borde inferior */
            border-bottom: 4px solid #CCFF00; 
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">

    <!-- Preheader -->
    <div style="display: none; max-height: 0px; overflow: hidden;">
        Tu perfil de corredor ha sido activado. Accede al terminal.
    </div>

    <center class="wrapper" style="width: 100%; background-color: #050505;">
        <div class="webkit" style="max-width: 600px; margin: 0 auto;">
            
            <!-- CONTENEDOR PRINCIPAL -->
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #000000; border-left: 1px solid #222; border-right: 1px solid #222;">
                
                <!-- STATUS BAR SUPERIOR -->
                <tr>
                    <td align="center" style="padding: 10px 0; background-color: #1a1a1a; border-bottom: 1px solid #333;">
                        <span style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #CCFF00; letter-spacing: 2px; text-transform: uppercase;">
                            ● SYSTEM CONNECTED
                        </span>
                    </td>
                </tr>

                <!-- LOGO -->
                <tr>
                    <td align="center" style="padding: 40px 0 20px 0;">
                        <a href="https://thedrop10k.space" target="_blank" style="text-decoration: none;">
                            <span style="font-family: 'Arial Black', Arial, sans-serif; font-size: 32px; color: #ffffff; letter-spacing: -2px; text-transform: uppercase;">
                                THE DROP<span style="color: #CCFF00; font-style: italic;">10K</span>
                            </span>
                        </a>
                    </td>
                </tr>

                <!-- TITULAR DE BIENVENIDA -->
                <tr>
                    <td align="left" style="padding: 20px 40px 10px 40px;">
                        <h1 style="margin: 0; font-family: 'Arial', sans-serif; font-weight: 900; font-size: 28px; line-height: 34px; color: #ffffff; text-transform: uppercase; letter-spacing: -0.5px;">
                            PERFIL ACTIVADO.
                        </h1>
                        <p style="margin: 10px 0 0 0; font-family: 'Courier New', Courier, monospace; font-size: 14px; color: #888888;">
                            // RUNNER_ID: NEW_ENTRY
                        </p>
                    </td>
                </tr>

                <!-- INTRODUCCIÓN (CORREGIDA) -->
                <tr>
                    <td align="left" style="padding: 0 40px 30px 40px; font-size: 16px; line-height: 24px; color: #cccccc;">
                        <p>
                            Bienvenido, <strong style="color: #ffffff;">${name}</strong>.
                        </p>
                        <p>
                            Tu cuenta ha sido creada correctamente. Ya no eres una visita anónima; ahora tienes credenciales de acceso. Este perfil es tu <strong>centro de mando</strong>, el lugar desde donde gestionarás tu asalto a tu marca personal en THE DROP.
                        </p>
                    </td>
                </tr>

                <!-- TARJETA DE PERFIL (ID CARD SIMULADO) -->
                <tr>
                    <td align="center" style="padding: 0 40px 40px 40px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="id-card">
                            <tr>
                                <td style="padding: 20px;">
                                    <!-- Header Tarjeta -->
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td valign="top">
                                                <span style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #666666; text-transform: uppercase;">
                                                    RUNNER PROFILE
                                                </span>
                                            </td>
                                            <td align="right" valign="top">
                                                <span style="font-size: 16px;">👤</span>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <!-- Datos -->
                                    <div style="margin-top: 20px; border-bottom: 1px solid #333; padding-bottom: 10px;">
                                        <span style="font-family: 'Arial', sans-serif; font-weight: bold; font-size: 24px; color: #ffffff; text-transform: uppercase; display: block;">
                                            ${name}
                                        </span>
                                    </div>
                                    
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 15px;">
                                        <tr>
                                            <td width="50%">
                                                <p style="margin: 0; font-size: 10px; color: #666666; text-transform: uppercase; font-family: 'Courier New', Courier, monospace;">STATUS</p>
                                                <p style="margin: 5px 0 0 0; font-size: 14px; color: #CCFF00; font-weight: bold;">ACTIVE</p>
                                            </td>
                                            <td width="50%">
                                                <p style="margin: 0; font-size: 10px; color: #666666; text-transform: uppercase; font-family: 'Courier New', Courier, monospace;">ACCESS LEVEL</p>
                                                <p style="margin: 5px 0 0 0; font-size: 14px; color: #ffffff; font-weight: bold;">MEMBER</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- INSTRUCCIONES SIGUIENTES (CORREGIDAS) -->
                <tr>
                    <td align="left" style="padding: 0 40px 40px 40px; font-size: 15px; line-height: 22px; color: #cccccc;">
                        <p style="margin: 0 0 10px 0; color: #CCFF00; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">
                            QUÉ SUCEDE AHORA:
                        </p>
                        <ol style="padding-left: 20px; margin: 0; color: #cccccc;">
                            <li style="margin-bottom: 10px;">Tu perfil será tu llave para <strong>adquirir el dorsal</strong> rápidamente en cuanto se abra la venta.</li>
                            <li style="margin-bottom: 10px;">Accede al <strong>Terminal de Usuario</strong> para definir y actualizar tu Tiempo Objetivo (Target PB).</li>
                            <li style="margin-bottom: 0;">Mantén tu información actualizada para asegurar que compites en la categoría correcta.</li>
                        </ol>
                    </td>
                </tr>

                <!-- BOTÓN CTA PRINCIPAL -->
                <tr>
                    <td align="center" style="padding: 0 40px 60px 40px;">
                        <table border="0" cellspacing="0" cellpadding="0" width="100%">
                            <tr>
                                <td align="center">
                                    <!-- Enlace al login/perfil de tu web -->
                                    <a href="https://thedrop10k.space/profile" target="_blank" class="btn" style="display: block; width: 100%; padding: 18px 0; background-color: #ffffff; color: #000000; font-family: 'Arial', sans-serif; font-size: 14px; font-weight: 900; text-transform: uppercase; text-decoration: none; letter-spacing: 1px; border: 2px solid #ffffff;">
                                        ACCEDER AL TERMINAL ->
                                    </a>
                                </td>
                            </tr>
                        </table>
                        <p style="margin-top: 20px; font-size: 12px; color: #444444; font-family: 'Courier New', Courier, monospace;">
                            Si no has solicitado este acceso, ignora esta transmisión.
                        </p>
                    </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                    <td align="center" style="background-color: #0a0a0a; padding: 40px; border-top: 1px solid #222222;">
                        <p style="margin: 0 0 15px 0; font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #555555; text-transform: uppercase;">
                            THE DROP 10K // PROFILE MANAGEMENT SYSTEM
                        </p>
                        <p style="margin: 0; font-size: 11px; color: #444444;">
                            <a href="#" style="color: #666666; text-decoration: none; margin: 0 10px;">Instagram</a>
                            <a href="#" style="color: #666666; text-decoration: none; margin: 0 10px;">Strava</a>
                            <a href="#" style="color: #666666; text-decoration: none; margin: 0 10px;">Login</a>
                        </p>
                    </td>
                </tr>

            </table>
        </div>
    </center>
</body>
</html>`;
                sendSmtpEmail.sender = { "name": "THE DROP 10K", "email": "race@thedrop10k.space" };
                sendSmtpEmail.to = [{ "email": email }];

                const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
                console.log('[Brevo] Email sent successfully. Message ID:', data.messageId);
            } catch (emailError) {
                console.error('Failed to send welcome email:', emailError);
                if (emailError.response && emailError.response.body) {
                    console.error('[Brevo] API Response Body:', JSON.stringify(emailError.response.body, null, 2));
                }
                // Continue execution, do not fail registration
            }
        } else {
            console.warn('[Brevo] No API Key configured. Skipping email.');
        }

        // Return user data (excluding password)
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({ message: 'User created', user: userWithoutPassword });

    } catch (error) {
        console.error('Error in /api/register:', error);
        res.status(500).json({ error: 'Internal Server Error: ' + error.message });
    }
};
