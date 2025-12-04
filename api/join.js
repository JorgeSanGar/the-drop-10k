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

    const { email, name, sex, mmpGoal } = req.body;

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
            mmpGoal: mmpGoal || false,
            date: new Date(),
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
        });

        // Send Email via Brevo
        const brevoKey = process.env.BREVO_API_KEY;
        if (brevoKey) {
            try {
                const apiInstance = new brevo.TransactionalEmailsApi();
                apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, brevoKey.trim());

                const sendSmtpEmail = new brevo.SendSmtpEmail();
                sendSmtpEmail.subject = "THE DROP: WAITLIST CONFIRMED";
                sendSmtpEmail.sender = { "name": "THE DROP 10K", "email": "race@thedrop10k.space" };
                sendSmtpEmail.to = [{ "email": email }];

                const userName = name ? name.toUpperCase() : 'RUNNER';

                sendSmtpEmail.htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>THE DROP - Waitlist Confirmation</title>
    <style>
        /* Reset básico */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #000000; }
        
        /* Estilos */
        .wrapper { width: 100%; table-layout: fixed; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #000000; }
        .webkit { max-width: 600px; margin: 0 auto; }
        .btn:hover { background-color: #ffffff !important; color: #000000 !important; }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">

    <!-- Preheader -->
    <div style="display: none; max-height: 0px; overflow: hidden;">
        No has elegido una carrera normal. Has elegido la velocidad pura.
    </div>

    <center class="wrapper" style="width: 100%; background-color: #000000;">
        <div class="webkit" style="max-width: 600px; margin: 0 auto;">
            
            <!-- CONTENEDOR -->
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #000000; border: 1px solid #333333;">
                
                <!-- LOGO -->
                <tr>
                    <td align="center" style="padding: 50px 0 30px 0;">
                        <a href="https://thedrop10k.space" target="_blank" style="text-decoration: none;">
                            <span style="font-family: 'Arial Black', Arial, sans-serif; font-size: 32px; color: #ffffff; letter-spacing: -2px; text-transform: uppercase;">
                                THE DROP<span style="color: #CCFF00; font-style: italic;">10K</span>
                            </span>
                        </a>
                    </td>
                </tr>

                <!-- DIVIDER LINE -->
                <tr>
                    <td align="center" style="padding: 0 40px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="border-bottom: 1px solid #333333;"></td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- TITULAR -->
                <tr>
                    <td align="left" style="padding: 40px 40px 20px 40px;">
                        <h1 style="margin: 0; font-family: 'Arial', sans-serif; font-weight: 900; font-size: 32px; line-height: 38px; color: #ffffff; text-transform: uppercase; letter-spacing: -0.5px;">
                            TU NOMBRE YA ESTÁ EN LA LISTA, <span style="color: #CCFF00;">${userName}</span>.
                        </h1>
                    </td>
                </tr>

                <!-- TEXTO 1: ASPIRACIONAL -->
                <tr>
                    <td align="left" style="padding: 0 40px 20px 40px; font-size: 16px; line-height: 26px; color: #cccccc;">
                        <p style="margin: 0;">
                            La mayoría de corredores buscan controlar cada variable: el recorrido, el perfil, el avituallamiento. Buscan seguridad.
                        </p>
                        <p style="margin: 20px 0 0 0;">
                            <strong>Tú has elegido la incertidumbre.</strong>
                        </p>
                        <p style="margin: 10px 0 0 0;">
                            Has decidido formar parte del 1% que no pregunta <em>dónde</em>, sino <em>cuándo</em>. THE DROP no es solo una carrera cuesta abajo; es la búsqueda de tu versión más rápida. Es un pacto con la gravedad.
                        </p>
                    </td>
                </tr>

                <!-- CAJA DE PRIVILEGIO -->
                <tr>
                    <td align="center" style="padding: 10px 40px 30px 40px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111111; border-left: 3px solid #CCFF00;">
                            <tr>
                                <td style="padding: 20px;">
                                    <p style="margin: 0 0 10px 0; font-size: 12px; color: #CCFF00; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">
                                        TU VENTAJA
                                    </p>
                                    <p style="margin: 0; font-size: 15px; line-height: 22px; color: #ffffff;">
                                        Tu intuición tiene recompensa. Recibirás el enlace de inscripción <strong>60 minutos antes</strong> que el resto del mundo. 
                                        <br><br>
                                        Cuando se abran las puertas al público general, tú ya tendrás tu dorsal asegurado.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- CIERRE MOTIVACIONAL -->
                <tr>
                    <td align="left" style="padding: 0 40px 40px 40px; font-size: 16px; line-height: 26px; color: #cccccc;">
                        <p style="margin: 0;">
                            No necesitas suerte. Necesitas enfoque. Visualiza el descenso. Entrena la mente para la velocidad que se viene.
                        </p>
                        <p style="margin: 20px 0 0 0; color: #ffffff; font-weight: bold;">
                            Nos vemos.
                        </p>
                    </td>
                </tr>

                <!-- BOTÓN -->
                <tr>
                    <td align="center" style="padding: 0 40px 60px 40px;">
                        <table border="0" cellspacing="0" cellpadding="0" width="100%">
                            <tr>
                                <td align="center">
                                    <a href="https://thedrop10k.space?action=login" target="_blank" class="btn" style="display: block; width: 100%; padding: 18px 0; background-color: #CCFF00; color: #000000; font-family: 'Arial', sans-serif; font-size: 14px; font-weight: 900; text-transform: uppercase; text-decoration: none; letter-spacing: 2px;">
                                        ESTADO: DENTRO
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- FOOTER MINIMALISTA -->
                <tr>
                    <td align="center" style="border-top: 1px solid #222222; padding: 40px;">
                        <p style="margin: 0 0 15px 0; font-family: 'Courier New', Courier, monospace; font-size: 12px; color: #666666; text-transform: uppercase;">
                            ÁVILA — CLASSIFIED LOCATION
                        </p>
                        <p style="margin: 0; font-size: 12px; color: #444444;">
                            <a href="#" style="color: #666666; text-decoration: none; margin-right: 15px;">Instagram</a>
                            <a href="https://www.strava.com/athletes/195749369" style="color: #666666; text-decoration: none;">Strava</a>
                        </p>
                    </td>
                </tr>

            </table>
        </div>
    </center>
</body>
</html>`;

                await apiInstance.sendTransacEmail(sendSmtpEmail);
            } catch (emailErr) {
                console.error('Error sending email:', emailErr);
            }
        }

        res.status(201).json({ message: 'Success' });

    } catch (error) {
        console.error('Error in /api/join:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
