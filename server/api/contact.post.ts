import { Resend } from 'resend'

const escape = (str: string) => str
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

const requests = new Map<string, number>()

export default defineEventHandler(async (event) => {
  const ip = getRequestHeader(event, 'x-forwarded-for') || 'unknown'
  const now = Date.now()
  const last = requests.get(ip) || 0

  if (now - last < 60_000) {
    throw createError({ statusCode: 429, message: 'Trop de messages. Attendez 1 minute.' })
  }
  requests.set(ip, now)

  const body = await readBody(event)
  const { nom, prenom, email, sujet, message, age, honeypot } = body

  if (honeypot) return { success: true }

  if (!nom || !prenom || !email || !message || !age) {
    throw createError({ statusCode: 400, message: 'Champs manquants.' })
  }

  const { resendApiKey } = useRuntimeConfig(event)
  const resend = new Resend(resendApiKey as string)

  const sujets: Record<string, string> = {
    commande: 'Passer une commande',
    info: 'Informations produits',
    partenariat: 'Partenariat / B2B',
    autre: 'Autre',
  }

  const sujetLabel = sujets[sujet] || 'Nouveau message'

  const { error } = await resend.emails.send({
    from: 'OMEGACBD <contact@omegacbd.fr>',
    to: ['jordan-billon@hotmail.fr'],
    replyTo: email,
    subject: `[Contact] ${sujetLabel} — ${escape(prenom)} ${escape(nom)}`,
    html: `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0a0a0a;border-radius:2px;overflow:hidden;">

        <!-- HEADER -->
        <tr>
          <td style="background:#0a0a0a;padding:40px 48px 32px;text-align:center;border-bottom:1px solid #2a2a2a;">
            <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#c9a96e;">OMEGACBD</p>
            <h1 style="margin:0 0 16px;font-size:28px;font-weight:300;color:#fafafa;letter-spacing:0.05em;">Nouveau message</h1>
            <div style="width:40px;height:1px;background:#c9a96e;margin:0 auto;"></div>
          </td>
        </tr>

        <!-- INFOS EXPÉDITEUR -->
        <tr>
          <td style="padding:32px 48px 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #1e1e1e;">
                  <span style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#aaaaaa;">Expéditeur</span><br>
                  <span style="font-size:15px;color:#fafafa;margin-top:4px;display:block;">${escape(prenom)} ${escape(nom)}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #1e1e1e;">
                  <span style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#aaaaaa;">Email</span><br>
                  <span style="font-size:15px;color:#c9a96e;margin-top:4px;display:block;">${escape(email)}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #1e1e1e;">
                  <span style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#aaaaaa;">Sujet</span><br>
                  <span style="font-size:15px;color:#fafafa;margin-top:4px;display:block;">${sujetLabel}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- MESSAGE -->
        <tr>
          <td style="padding:32px 48px;">
            <p style="margin:0 0 12px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#aaaaaa;">Message</p>
            <div style="background:#141414;border-left:3px solid #c9a96e;padding:20px 24px;border-radius:1px;">
              <p style="margin:0;font-size:15px;color:#fafafa;line-height:1.7;">${escape(message).replace(/\n/g, '<br>')}</p>
            </div>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="padding:24px 48px 40px;border-top:1px solid #2a2a2a;text-align:center;">
            <p style="margin:0;font-size:11px;color:#555555;letter-spacing:0.1em;">omegacbd.fr — CBD Premium</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  })

  if (error) {
    console.error('Resend error:', JSON.stringify(error))
    throw createError({ statusCode: 500, message: error.message || 'Erreur envoi email.' })
  }

  return { success: true }
})
