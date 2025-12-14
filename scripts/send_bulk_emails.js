require('dotenv').config();
const brevo = require('@getbrevo/brevo');

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
// USER DATA
// ------------------------------------------------
const users = [
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
// EMAIL TEMPLATE
// ------------------------------------------------
const getHtmlContent = (name, code) => {
    const waLink = `https://wa.me/?text=${encodeURIComponent(`Hola! Te paso una invitación VIP para The Drop10K. Entra aquí: https://thedrop10k.space/registro-vip?ref=${code} y usa mi código: ${code}`)}`;
    const mailLink = `mailto:?subject=${encodeURIComponent(`Invitación VIP The Drop10K`)}&body=${encodeURIComponent(`Hola,\n\nTe invito a entrar en The Drop10K con acceso prioritario.\nRegístrate aquí: https://thedrop10k.space/registro-vip?ref=${code}\n\nCódigo obligatorio: ${code}`)}`;

    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
};

// ------------------------------------------------
// BULK SEND LOGIC
// ------------------------------------------------
async function sendBulkEmails() {
    console.log(`🚀 Starting bulk email send for ${users.length} users...`);
    let successCount = 0;
    let errorCount = 0;

    for (const user of users) {
        try {
            console.log(`📨 Sending to: ${user.nombre} (${user.email})`);

            const sendSmtpEmail = new brevo.SendSmtpEmail();
            sendSmtpEmail.subject = "✅ He analizado tu perfil: Eres Miembro Fundador";
            sendSmtpEmail.sender = { "name": "Jorge / The Drop10K", "email": "race@thedrop10k.space" };
            sendSmtpEmail.to = [{ "email": user.email }];
            sendSmtpEmail.htmlContent = getHtmlContent(user.nombre, user.code);

            await apiInstance.sendTransacEmail(sendSmtpEmail);
            console.log(`✅ Sent to ${user.email}`);
            successCount++;

            // Small delay to be gentle with API limits
            await new Promise(resolve => setTimeout(resolve, 200));

        } catch (error) {
            console.error(`❌ Error sending to ${user.email}:`, error.message);
            errorCount++;
        }
    }

    console.log('\n------------------------------------------------');
    console.log('🎉 Bulk Send Complete');
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log('------------------------------------------------');
}

sendBulkEmails();
