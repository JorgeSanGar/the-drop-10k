const admin = require('firebase-admin');
const brevo = require('@getbrevo/brevo');

// Initialize Brevo Client
const defaultClient = brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];

module.exports = async (req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { senderEmail, senderName, senderSurname, rivalEmail } = req.body;

    if (!senderEmail || !rivalEmail || !senderName) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Initialize Brevo API Key from Environment
        const brevoKey = process.env.BREVO_API_KEY;
        if (!brevoKey) {
            throw new Error('BREVO_API_KEY is not configured');
        }
        apiKey.apiKey = brevoKey;

        const apiInstance = new brevo.TransactionalEmailsApi();
        const sendSmtpEmail = new brevo.SendSmtpEmail();

        sendSmtpEmail.subject = `¿Vas a dejar que ${senderName} gane tan fácil?`;
        sendSmtpEmail.sender = { "name": "THE DROP 10K", "email": "race@thedrop10k.space" };
        sendSmtpEmail.to = [{ "email": rivalEmail }];

        // HTML Template with dynamic data
        sendSmtpEmail.htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>THE DROP - Challenge Received</title>
    <style>
        /* Reset básico para Email */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #000000; }
        
        /* Estilos de Botón */
        .btn:hover { background-color: #ffffff !important; color: #000000 !important; }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">

    <!-- Preheader (Texto invisible) -->
    <div style="display: none; max-height: 0px; overflow: hidden;">
        Un corredor ha marcado tu perfil como objetivo. Cree que no puedes superar su tiempo, demuéstrale lo contrario.
    </div>

    <center class="wrapper" style="width: 100%; background-color: #000000;">
        <div class="webkit" style="max-width: 600px; margin: 0 auto;">
            
            <!-- CONTENEDOR PRINCIPAL -->
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #000000; border: 1px solid #333333;">
                
                <!-- HEADER: ALERTA ROJA (Para diferenciar que es un reto) -->
                <tr>
                    <td align="center" style="padding: 10px 0; background-color: #1a0505; border-bottom: 1px solid #ff3333;">
                        <span style="font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #ff3333; letter-spacing: 3px; text-transform: uppercase; font-weight: bold;">
                            ⚠ INCOMING CHALLENGE ⚠
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

                <!-- MENSAJE PRINCIPAL -->
                <tr>
                    <td align="left" style="padding: 20px 40px 10px 40px;">
                        <h1 style="margin: 0; font-family: 'Arial', sans-serif; font-weight: 900; font-size: 36px; line-height: 40px; color: #ffffff; text-transform: uppercase; letter-spacing: -1px;">
                            TE HAN MARCADO<br>COMO RIVAL.
                        </h1>
                    </td>
                </tr>

                <!-- DATOS DEL RETADOR (ESTILO FICHA TÉCNICA) -->
                <tr>
                    <td align="center" style="padding: 20px 40px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111111; border-left: 4px solid #CCFF00;">
                            <tr>
                                <td style="padding: 20px;">
                                    <p style="margin: 0 0 5px 0; font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #888888; text-transform: uppercase;">
                                        CHALLENGER ID
                                    </p>
                                    <!-- AQUÍ VAN TUS TAGS DE NOMBRE Y APELLIDO -->
                                    <p style="margin: 0 0 20px 0; font-family: 'Arial Black', sans-serif; font-size: 24px; color: #ffffff; text-transform: uppercase; letter-spacing: -0.5px;">
                                        ${senderName} ${senderSurname}
                                    </p>

                                    <!-- SIMULACIÓN DEL TIEMPO OBJETIVO (SI LO TIENES EN LA VARIABLE, PONLO, SI NO, DEJA ESTO GENÉRICO) -->
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #333333; padding-top: 15px;">
                                        <tr>
                                            <td valign="top">
                                                <p style="margin: 0; font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #888888; text-transform: uppercase;">
                                                    TARGET PACE
                                                </p>
                                                <p style="margin: 5px 0 0 0; font-family: 'Arial', sans-serif; font-size: 32px; font-weight: 900; color: #CCFF00; letter-spacing: -1px;">
                                                    43:00
                                                </p>
                                            </td>
                                            <td align="right" valign="bottom">
                                                <span style="font-size: 10px; color: #666666; font-family: 'Courier New', Courier, monospace;">
                                                    WAVE 3 (SUB-45)
                                                </span>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- TEXTO PROVOCADOR -->
                <tr>
                    <td align="left" style="padding: 10px 40px 30px 40px; font-size: 16px; line-height: 24px; color: #cccccc;">
                        <p>
                            <span style="color: #ffffff; font-weight: bold;">${senderName}</span> ya tiene su perfil activo en el sistema y cree que su tiempo es inalcanzable para ti.
                        </p>
                        <p>
                            En THE DROP, las palabras no cuentan. Solo cuenta la gravedad. Tienes dos opciones: ignorar este mensaje y concederle la victoria, o aceptar el duelo y demostrar quién manda cuesta abajo.
                        </p>
                    </td>
                </tr>

                <!-- BOTÓN CTA -->
                <tr>
                    <td align="center" style="padding: 0 40px 60px 40px;">
                        <table border="0" cellspacing="0" cellpadding="0" width="100%">
                            <tr>
                                <td align="center">
                                    <a href="https://thedrop10k.space" target="_blank" class="btn" style="display: block; width: 100%; padding: 18px 0; background-color: #CCFF00; color: #000000; font-family: 'Arial', sans-serif; font-size: 14px; font-weight: 900; text-transform: uppercase; text-decoration: none; letter-spacing: 2px;">
                                        ACEPTAR DESAFÍO ->
                                    </a>
                                </td>
                            </tr>
                        </table>
                        <p style="margin-top: 20px; font-size: 11px; color: #444444; font-family: 'Courier New', Courier, monospace; text-transform: uppercase;">
                            ADVERTENCIA: AL ACEPTAR, ENTRAS EN LA LISTA PRIORITARIA.
                        </p>
                    </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                    <td align="center" style="background-color: #0a0a0a; padding: 40px; border-top: 1px solid #222222;">
                        <p style="margin: 0 0 15px 0; font-family: 'Courier New', Courier, monospace; font-size: 11px; color: #555555; text-transform: uppercase;">
                            THE DROP 10K // RIVALRY SYSTEM
                        </p>
                        <p style="margin: 0; font-size: 11px; color: #444444;">
                            <a href="#" style="color: #666666; text-decoration: none; margin: 0 10px;">Instagram</a>
                            <a href="#" style="color: #666666; text-decoration: none; margin: 0 10px;">Strava</a>
                        </p>
                    </td>
                </tr>

            </table>
        </div>
    </center>
</body>
</html>`;

        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`[Brevo] Challenge email sent to ${rivalEmail} from ${senderName}`);

        res.status(200).json({ message: 'Challenge sent successfully' });

    } catch (error) {
        console.error('Error sending challenge email:', error);
        res.status(500).json({ error: 'Failed to send challenge email' });
    }
};
