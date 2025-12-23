const brevo = require('@getbrevo/brevo');
require('dotenv').config();

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

const recipients = [
    "adrianaramoscalvo@hotmail.com",
    "alfchulin@hotmail.com",
    "alsago13@gmail.com",
    "ana.blanco1993@gmail.com",
    "borja15@hotmail.com", // Corrected typo from .vom
    "crisavila10@hotmail.com",
    "cvj_24@hotmail.com",
    "davort1087@gmail.com",
    "dedompablosanchez@gmail.com",
    "dfg1204@gmail.com",
    "dubyperaza@gmail.com",
    "dunajimenezgarcia@gmail.com",
    "franquesmun@gmail.com",
    "garbyxd@gmail.com",
    "hervijas@yahoo.es",
    "javilucho17@hotmail.com",
    "jdelgadobeotas@gmail.com",
    "jesusgoes@gmail.com",
    "jorgesanchez.js876@gmail.com",
    "juanluat@yahoo.es",
    "lucialojo96@gmail.com",
    "mariahm97@me.com",
    "mariajimenezamo89@hotmail.com",
    "neumaticossangar.sl@gmail.com",
    "olguijueli82@hotmail.com",
    "pablo25dr@gmail.com",
    "pedroencinar@gmail.com",
    "ramongtc@hotmail.com",
    "rebeca0912@gmail.com",
    "ruben.ravila@gmail.com",
    "samipprieto@gmail.com"
];

// Fecha de envío: Jueves 18 de Diciembre de 2025 a las 09:00 AM hora española (CET/UTC+1)
// En UTC es 08:00 AM
const scheduledTime = new Date("2025-12-18T08:00:00.000Z");

const htmlContent = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="x-apple-disable-message-reformatting">
  <!-- Forzamos esquema dark para que Gmail respete el fondo negro si es posible -->
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>The Drop10K | Tu esfuerzo, no tu suerte.</title>

  <!--[if !mso]><!-->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet">
  <!--<![endif]-->

  <style type="text/css">
    /* RESET & CORE */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; display: block; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #050505; color: #FFFFFF; font-family: 'Inter', Helvetica, Arial, sans-serif; }

    /* BRAND TOKENS */
    :root { color-scheme: light dark; supported-color-schemes: light dark; }
    
    /* FORZAR COLORES CON !important PARA EVITAR OVERRIDES DE GMAIL */
    .text-neon { color: #CCFF00 !important; }
    .bg-neon { background-color: #CCFF00 !important; }
    .border-neon { border: 1px solid #CCFF00 !important; }

    /* UTILS */
    .mobile-hidden { display: block; }
    .desktop-hidden { display: none; }

    /* MOBILE QUERIES */
    @media screen and (max-width: 600px) {
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .mobile-stack { display: block !important; width: 100% !important; max-width: 100% !important; direction: ltr !important; }
      .mobile-center { text-align: center !important; }
      .h1-mobile { font-size: 28px !important; line-height: 1.1 !important; }
      .p-mobile { font-size: 16px !important; line-height: 1.5 !important; }
      .mobile-hidden { display: none !important; }
      .desktop-hidden { display: block !important; }
      .card-padding { padding: 20px !important; }
    }

    /* BUTTON HOVER */
    .cta-button:hover { background-color: #b3e600 !important; border-color: #b3e600 !important; }
    .secondary-button:hover { background-color: rgba(204,255,0,0.08) !important; border-color: #b3e600 !important; }

    /* 
       HACK: Forzar estilos oscuros incluso en modo claro.
       Gmail a veces ignora esto, pero con !important en inline styles tenemos más oportunidad.
    */
    @media (prefers-color-scheme: light) {
      body, center, table, td, div { background-color: #050505 !important; }
      h1, h2, p, td, a, span { color: #FFFFFF !important; }
      .text-neon { color: #CCFF00 !important; }
      .cta-button { background-color: #CCFF00 !important; border-color: #CCFF00 !important; color: #000000 !important; }
      .secondary-button { background-color: #111111 !important; border-color: #CCFF00 !important; color: #CCFF00 !important; }
    }
  </style>
</head>

<body bgcolor="#050505" style="margin:0; padding:0; background-color:#050505;">

  <!-- PREHEADER -->
  <div style="display:none; max-height:0px; overflow:hidden; color:#050505;">
    🎄 VISUALIZA TU PREMIO: Probabilidad de éxito actualizada al 100%. Genera tu décimo ahora.
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <center style="width:100%; background-color:#050505;" bgcolor="#050505">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; background-color:#050505; margin:0 auto;" bgcolor="#050505">

      <!-- HEADER -->
      <tr>
        <td bgcolor="#050505" style="padding:20px 0; border-bottom:1px solid #222222; background-color:#050505;">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#050505" style="background-color:#050505;">
            <tr>
              <td align="left" style="padding-left:20px; font-family:'Share Tech Mono', monospace; font-size:10px; color:#666666; letter-spacing:1px;">
                // SYSTEM_ID: THE_DROP10K
              </td>
              <td align="right" style="padding-right:20px; font-family:'Share Tech Mono', monospace; font-size:10px; color:#CCFF00 !important; letter-spacing:1px;">
                <span style="color:#CCFF00 !important;">● STATUS: ACTIVE</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- HERO -->
      <tr>
        <td bgcolor="#050505" style="padding:40px 20px; background-color:#050505;" class="mobile-padding">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#111111"
                 style="border:2px solid #333333; background-color:#111111; position:relative;">
            <tr>
              <td height="4" bgcolor="#CCFF00" style="background-color:#CCFF00 !important; font-size:1px; line-height:1px;">&nbsp;</td>
            </tr>
            <tr>
              <td bgcolor="#111111" style="padding:30px; background-color:#111111;" class="card-padding">
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#111111" style="background-color:#111111;">
                  <tr>
                    <td align="left" style="background-color:#111111;">
                      <p style="margin:0; font-family:'Share Tech Mono', monospace; font-size:12px; color:#888888; text-transform:uppercase; letter-spacing:2px;">
                        Sorteo Extraordinario
                      </p>
                      <h1 style="margin:10px 0 5px 0; font-family:'Inter', sans-serif; font-size:32px; font-weight:900; color:#FFFFFF; letter-spacing:-1px; text-transform:uppercase;">
                        The Drop10K
                      </h1>
                      <p style="margin:0; font-family:'Share Tech Mono', monospace; font-size:14px; color:#CCFF00 !important; text-transform:uppercase;">
                        <span style="color:#CCFF00 !important;">// Ticket #YOU-VS-YOU</span>
                      </p>
                    </td>
                    <td align="right" valign="top" class="mobile-hidden" style="background-color:#111111;">
                      <table role="presentation" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" style="background-color:#FFFFFF; width:60px; height:60px;">
                        <tr>
                          <td align="center" valign="middle" style="font-size:10px; color:#000000; font-weight:bold;">[QR]</td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td colspan="2" style="padding:25px 0; background-color:#111111;">
                      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#111111" style="background-color:#111111;">
                        <tr>
                          <td style="border-bottom:1px dashed #444444; height:1px; font-size:0; line-height:0;">&nbsp;</td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td colspan="2" style="background-color:#111111;">
                      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#111111" style="background-color:#111111;">
                        <tr>
                          <td width="50%" valign="top" style="background-color:#111111;">
                            <p style="margin:0 0 5px 0; font-family:'Share Tech Mono', monospace; font-size:10px; color:#666666;">FECHA</p>
                            <p style="margin:0; font-family:'Inter', sans-serif; font-size:16px; font-weight:700; color:#FFFFFF;">22 DIC</p>
                          </td>
                          <td width="50%" valign="top" style="background-color:#111111;">
                            <p style="margin:0 0 5px 0; font-family:'Share Tech Mono', monospace; font-size:10px; color:#666666;">PROBABILIDAD</p>
                            <p style="margin:0; font-family:'Inter', sans-serif; font-size:16px; font-weight:700; color:#CCFF00 !important;">
                                <span style="color:#CCFF00 !important;">100%</span>
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- HEADLINE -->
      <tr>
        <td bgcolor="#050505" style="padding:0 40px 20px 40px; background-color:#050505;" class="mobile-padding">
          <h2 class="h1-mobile" style="margin:0; font-family:'Inter', sans-serif; font-size:32px; line-height:1.1; font-weight:900; color:#FFFFFF; text-transform:uppercase; letter-spacing:-1px;">
            La suerte es un impuesto a la <span style="color:#CCFF00 !important; background-color:rgba(204,255,0,0.10);">esperanza.</span>
          </h2>
        </td>
      </tr>

      <!-- COPY -->
      <tr>
        <td bgcolor="#050505" style="padding:0 40px 30px 40px; background-color:#050505;" class="mobile-padding">
          <p class="p-mobile" style="margin:0 0 20px 0; font-family:'Inter', sans-serif; font-size:16px; line-height:1.6; color:#CCCCCC;">
            Mientras el país entero hace cola esperando un milagro, tú sabes la verdad matemática:
            <strong style="color:#FFFFFF;">el "premio" no toca. El "premio" se suda.</strong>
          </p>
        </td>
      </tr>

      <!-- COMPARISON -->
      <tr>
        <td bgcolor="#050505" style="padding:0 20px 30px 20px; background-color:#050505;" class="mobile-padding">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#1a1a1a" style="background-color:#1a1a1a; border-radius:4px;">
            <tr>
              <th width="50%" style="padding:15px; border-right:1px solid #333333; border-bottom:2px solid #333333; text-align:left;">
                <p style="margin:0; font-family:'Share Tech Mono', monospace; font-size:12px; color:#888888;">LOTERÍA NACIONAL</p>
              </th>
              <th width="50%" style="padding:15px; border-bottom:2px solid #CCFF00; border-color:#CCFF00 !important; text-align:left;">
                <p style="margin:0; font-family:'Share Tech Mono', monospace; font-size:12px; color:#CCFF00 !important;">
                    <span style="color:#CCFF00 !important;">THE DROP10K</span>
                </p>
              </th>
            </tr>
            <tr>
              <td style="padding:15px; border-right:1px solid #333333; vertical-align:top;">
                <p style="margin:0; font-family:'Inter', sans-serif; font-size:24px; font-weight:700; color:#666666;">0,00001%</p>
                <p style="margin:5px 0 0 0; font-size:12px; color:#555555;">Probabilidad de éxito</p>
              </td>
              <td style="padding:15px; vertical-align:top; background-color:rgba(204,255,0,0.05);">
                <p style="margin:0; font-family:'Inter', sans-serif; font-size:24px; font-weight:700; color:#FFFFFF;">100%</p>
                <p style="margin:5px 0 0 0; font-size:12px; color:#CCCCCC;">Retorno de esfuerzo</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- COPY 2 -->
      <tr>
        <td bgcolor="#050505" style="padding:0 40px 30px 40px; background-color:#050505;" class="mobile-padding">
          <p class="p-mobile" style="margin:0; font-family:'Inter', sans-serif; font-size:16px; line-height:1.6; color:#CCCCCC;">
            En The Drop10K hemos hackeado el sistema: eliminamos el azar y lo sustituimos por física, gravedad y disciplina.
          </p>
        </td>
      </tr>

      <!-- CTA -->
      <tr>
        <td align="center" bgcolor="#050505" style="padding:10px 40px 50px 40px; background-color:#050505;" class="mobile-padding">
          <p style="margin:0 0 15px 0; font-family:'Share Tech Mono', monospace; font-size:12px; color:#CCFF00 !important;">
            <span style="color:#CCFF00 !important;">▼ INICIAR PROTOCOLO</span>
          </p>

          <!-- PRIMARY -->
          <div>
            <!--[if mso]>
            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
              href="https://www.thedrop10k.space/decimo-del-reto"
              style="height:55px;v-text-anchor:middle;width:100%;" arcsize="0%" stroke="f" fillcolor="#CCFF00">
              <w:anchorlock/>
              <center style="color:#000000;font-family:Helvetica, Arial, sans-serif;font-size:16px;font-weight:bold;">GENERAR MI DÉCIMO</center>
            </v:roundrect>
            <![endif]-->
            <!--[if !mso]><!-- -->
            <a href="https://www.thedrop10k.space/decimo-del-reto" class="cta-button"
               style="background-color:#CCFF00 !important; color:#000000 !important; display:inline-block; font-family:'Inter', Helvetica, Arial, sans-serif;
               font-size:16px; font-weight:900; line-height:55px; text-align:center; text-decoration:none; width:100%;
               -webkit-text-size-adjust:none; text-transform:uppercase; letter-spacing:1px; border:1px solid #CCFF00 !important;">
              GENERAR MI DÉCIMO
            </a>
            <!--<![endif]-->
          </div>

          <!-- SECONDARY -->
          <div style="margin-top:12px;">
            <!--[if mso]>
            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
              href="https://www.thedrop10k.space/"
              style="height:48px;v-text-anchor:middle;width:100%;" arcsize="0%" stroke="t" strokecolor="#CCFF00" fillcolor="#111111">
              <w:anchorlock/>
              <center style="color:#CCFF00;font-family:Helvetica, Arial, sans-serif;font-size:14px;font-weight:bold;">IR A LA WEB</center>
            </v:roundrect>
            <![endif]-->
            <!--[if !mso]><!-- -->
            <a href="https://www.thedrop10k.space/" class="secondary-button"
               style="background-color:#111111 !important; color:#CCFF00 !important; display:inline-block; font-family:'Inter', Helvetica, Arial, sans-serif;
               font-size:14px; font-weight:900; line-height:48px; text-align:center; text-decoration:none; width:100%;
               -webkit-text-size-adjust:none; text-transform:uppercase; letter-spacing:1px; border:1px solid #CCFF00 !important;">
              IR A LA WEB
            </a>
            <!--<![endif]-->
          </div>

          <p style="margin:15px 0 0 0; font-family:'Share Tech Mono', monospace; font-size:11px; color:#666666;">
            * Este décimo se paga con sudor, no con euros.
          </p>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td bgcolor="#111111" style="background-color:#111111; padding:40px 20px; border-top:1px solid #222222;">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#111111" style="background-color:#111111;">
            <tr>
              <td align="center" style="background-color:#111111;">
                <p style="margin:0 0 10px 0; font-family:'Share Tech Mono', monospace; font-size:12px; color:#666666; text-transform:uppercase;">
                  The Drop10K // The Prediction Protocol
                </p>
                <p style="margin:0; font-family:'Inter', sans-serif; font-size:11px; color:#444444; line-height:1.5;">
                  Recibes este correo porque elegiste el camino difícil.<br>
                  <a href="https://www.thedrop10k.space/" style="color:#666666; text-decoration:underline;">Abrir la web</a>
                  &nbsp;·&nbsp;
                  <a href="#" style="color:#666666; text-decoration:underline;">Darse de baja</a> si prefieres la suerte.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

    </table>
  </center>
</body>
</html>`;

const scheduleCampaign = async () => {
    console.log(`🚀 Iniciando programación de campaña para ${recipients.length} destinatarios...`);
    console.log(`📅 Fecha programada: ${scheduledTime.toISOString()} (UTC) / 09:00 AM (España)`);

    let successCount = 0;
    let errorCount = 0;

    for (const email of recipients) {
        const sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.subject = "Tu Décimo de Navidad: no esperes a la suerte";
        sendSmtpEmail.sender = { "name": "The Drop10K", "email": "race@thedrop10k.space" };
        sendSmtpEmail.to = [{ "email": email }];
        sendSmtpEmail.htmlContent = htmlContent;
        sendSmtpEmail.scheduledAt = scheduledTime;
        sendSmtpEmail.tags = ["CAMPAIGN_DECIMO"];

        try {
            await apiInstance.sendTransacEmail(sendSmtpEmail);
            console.log(`✅ Programado para: ${email}`);
            successCount++;
        } catch (error) {
            console.error(`❌ Error programando para ${email}:`, error.body || error.message);
            errorCount++;
        }

        // Pequeña pausa para no saturar la API (rate limiting preventivo)
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n📊 Resumen de programación:');
    console.log(`✅ Exitosos: ${successCount}`);
    console.log(`❌ Fallidos: ${errorCount}`);
};

scheduleCampaign();
