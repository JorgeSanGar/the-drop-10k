require('dotenv').config();
const admin = require('firebase-admin');
const brevo = require('@getbrevo/brevo');

// ------------------------------------------------
// FIREBASE SETUP
// ------------------------------------------------
let db;
try {
    let serviceAccount;
    try {
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
// BREVO SETUP
// ------------------------------------------------
const apiInstance = new brevo.TransactionalEmailsApi();
const apiKey = process.env.BREVO_API_KEY;
if (!apiKey) {
    console.error('❌ BREVO_API_KEY is missing in environment variables');
    process.exit(1);
}
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);

// ------------------------------------------------
// MAIN LOGIC
// ------------------------------------------------
async function sendTestEmail() {
    const targetEmail = 'jorgesanchez.js876@gmail.com';
    console.log(`🔍 Searching for user: ${targetEmail}`);

    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', targetEmail).get();

        let name = "Jorge (Test)";
        let code = "TEST_VIP_001";

        if (!snapshot.empty) {
            const userData = snapshot.docs[0].data();
            console.log('✅ User found in database');
            console.log('📋 User Data:', JSON.stringify(userData, null, 2)); // Debug log

            // Try multiple field names
            if (userData.name) name = userData.name;
            else if (userData.firstName) name = userData.firstName;
            else if (userData.nombre) name = userData.nombre;

            if (userData.referral_code) code = userData.referral_code;
        } else {
            console.log('⚠️ User not found, using default test data');
        }

        console.log(`📝 Preparing email for: ${name} (Code: ${code})`);

        // Construct Links
        const waLink = `https://wa.me/?text=${encodeURIComponent(`Hola! Te paso una invitación VIP para The Drop10K. Entra aquí: https://thedrop10k.space/registro-vip?ref=${code} y usa mi código: ${code}`)}`;
        const mailLink = `mailto:?subject=${encodeURIComponent(`Invitación VIP The Drop10K`)}&body=${encodeURIComponent(`Hola,\n\nTe invito a entrar en The Drop10K con acceso prioritario.\nRegístrate aquí: https://thedrop10k.space/registro-vip?ref=${code}\n\nCódigo obligatorio: ${code}`)}`;

        // HTML Content
        const htmlContent = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>THE DROP 10K - FOUNDER STATUS</title>
    <style type="text/css">
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #F2F2F2; }
        .btn-hype:hover { background-color: #ffffff !important; color: #000000 !important; border: 2px solid #000000 !important; }
        @media screen and (max-width: 600px) { .email-container { width: 100% !important; } .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; } .mobile-text-l { font-size: 32px !important; line-height: 36px !important; } }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F2F2F2;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F2F2F2;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="background-color: #ffffff; border: 1px solid #000000;">
                    <tr>
                        <td align="center" style="background-color: #F2F2F2; border-bottom: 2px solid #000000; padding: 20px;">
                            <span style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-weight: 900; font-size: 24px; letter-spacing: -1px; font-style: italic;">THE DROP<span style="display:inline-block; transform: skewX(-12deg);">10K</span>™</span>
                        </td>
                    </tr>
                    <tr><td align="center" style="background-color: #CCFF00; border-bottom: 2px solid #000000; padding: 5px; overflow: hidden;"><div style="font-family: 'Courier New', Courier, monospace; font-size: 10px; font-weight: bold; text-transform: uppercase; white-space: nowrap; overflow: hidden;">/// PRIVATE ACCESS /// MIEMBRO FUNDADOR /// PRIVATE ACCESS /// MIEMBRO FUNDADOR ///</div></td></tr>
                    <tr><td align="center" style="padding: 0; border-bottom: 1px solid #000000;"><img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmhmbHBxbjJ6ZmdnMzhxbzJ6ZmdnMzhxbzJ6ZmdnMzhxbzJ6ZmdnMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKSjRrfIPjeiVyM/giphy.gif" alt="THE DROP" width="600" style="display: block; width: 100%; max-width: 600px; height: auto;" /></td></tr>
                    <tr>
                        <td class="mobile-padding" style="padding: 40px 40px 20px 40px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111111;">
                            <p style="font-family: 'Courier New', Courier, monospace; font-size: 12px; color: #666666; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">[ PROTOCOL: VIP_ACCESS ]</p>
                            
                            <h1 class="mobile-text-l" style="font-size: 42px; line-height: 44px; font-weight: 900; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: -1px;">
                                ERES MIEMBRO<br>FUNDADOR.
                            </h1>

                            <p style="font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">Hola <strong>${name}</strong>,</p>
                            <p style="font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">Te escribo este domingo de forma un poco más personal. He estado analizando los perfiles de quienes estáis dentro y me ha llamado la atención el tuyo.</p>
                            <p style="font-size: 16px; line-height: 24px; margin: 0 0 20px 0; padding-left: 15px; border-left: 3px solid #CCFF00;"><strong>La calidad de nuestra comunidad es lo más importante ahora mismo.</strong></p>
                            <p style="font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">Por eso, como agradecimiento por estar aquí desde el inicio, he activado oficialmente tu estatus de <strong>Miembro Fundador</strong>.</p>
                            
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #000000; color: #ffffff; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 30px; text-align: center; border: 2px solid #CCFF00;">
                                        <p style="font-family: 'Courier New', Courier, monospace; font-size: 12px; color: #CCFF00; margin: 0 0 10px 0; text-transform: uppercase;">/// TU CÓDIGO DE FUNDADOR ///</p>
                                        <h2 style="font-size: 32px; margin: 0 0 20px 0; letter-spacing: 2px;">${code}</h2>
                                        <p style="font-size: 14px; color: #cccccc; margin: 0 0 25px 0;">Se te han asignado 3 invitaciones para reclutar a tu equipo:</p>
                                        
                                        <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" style="max-width: 300px;">
                                            <tr>
                                                <td align="center" bgcolor="#CCFF00" style="border: 2px solid #000000;">
                                                    <a href="${waLink}" target="_blank" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: bold; color: #000000; text-decoration: none; padding: 15px 10px; display: block; text-transform: uppercase;">
                                                        ENVIAR INVITACIÓN (WHATSAPP) 💬
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%"><tr><td height="15" style="font-size: 15px; line-height: 15px;">&nbsp;</td></tr></table>
                                        
                                        <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" style="max-width: 300px;">
                                            <tr>
                                                <td align="center" bgcolor="#000000" style="border: 1px solid #ffffff;">
                                                    <a href="${mailLink}" target="_blank" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: bold; color: #ffffff; text-decoration: none; padding: 15px 10px; display: block; text-transform: uppercase;">
                                                        ENVIAR INVITACIÓN (EMAIL) ✉️
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            <p style="font-size: 14px; line-height: 22px; color: #666666; margin: 0 0 20px 0;">*No tienes ninguna obligación de usarlas. Pero si hay alguien en tu círculo que crees que debería estar dentro, ahora es el momento de invitarle a la mesa.</p>
                            <p style="font-size: 16px; line-height: 24px; margin: 0 0 10px 0;">Gracias por la confianza. Se vienen cosas muy grandes.</p>
                            <p style="font-size: 16px; line-height: 24px; margin: 0;">Un abrazo,<br><strong>Jorge</strong><br><span style="font-size: 12px; text-transform: uppercase; color: #999999;">Founder, The Drop10K</span></p>
                        </td>
                    </tr>
                    <tr><td align="center" style="background-color: #000000; padding: 30px 20px; color: #666666; font-family: 'Courier New', Courier, monospace; font-size: 10px; border-top: 1px solid #333333;"><p style="margin: 0 0 10px 0; text-transform: uppercase;">© 2025 THE DROP 10K. ÁVILA. ALL RIGHTS RESERVED.</p><p style="margin: 0;"><a href="#" style="color: #666666; text-decoration: underline;">Unsubscribe</a> | <a href="#" style="color: #666666; text-decoration: underline;">View Online</a></p></td></tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

        const sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.subject = "[TEST] Hemos analizado tu perfil: Eres Miembro Fundador";
        sendSmtpEmail.sender = { "name": "Jorge de The Drop10K", "email": "race@thedrop10k.space" };
        sendSmtpEmail.to = [{ "email": targetEmail }];
        sendSmtpEmail.htmlContent = htmlContent;

        console.log('🚀 Sending email via Brevo...');
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('✅ Email sent successfully!');

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

sendTestEmail();
