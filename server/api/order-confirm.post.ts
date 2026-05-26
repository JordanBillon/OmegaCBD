import { Resend } from 'resend'
import { serverSupabaseUser } from '#supabase/server'

const escape = (str: string) => String(str)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

const requests = new Map<string, number>()

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Non authentifié.' })
  }

  const ip = (getRequestHeader(event, 'x-forwarded-for') || 'unknown').split(',')[0]?.trim() ?? 'unknown'
  const now = Date.now()
  if ((requests.get(ip) || 0) > now - 60_000) {
    throw createError({ statusCode: 429, message: 'Trop de requêtes. Attendez 1 minute.' })
  }
  requests.set(ip, now)
  if (requests.size > 10_000) {
    const cutoff = now - 60_000
    for (const [k, v] of requests) {
      if (v < cutoff) requests.delete(k)
    }
  }

  const body = await readBody(event)
  const { items, total, shipping_address, first_name } = body
  const email = user.email

  if (!items?.length || !total || !shipping_address || !email) {
    throw createError({ statusCode: 400, message: 'Données manquantes.' })
  }
  if (!items.every((i: any) => i.name && Number(i.price) >= 0 && Number(i.quantity) > 0)) {
    throw createError({ statusCode: 400, message: 'Articles invalides.' })
  }

  const { resendApiKey } = useRuntimeConfig(event)
  const resend = new Resend(resendApiKey as string)

  const itemsRows = items.map((item: any) => `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid #1e1e1e;color:#fafafa;font-size:14px;line-height:1.4;">
        ${escape(item.name)}<br>
        <span style="color:#aaaaaa;font-size:12px;letter-spacing:0.08em;">${escape(item.weight)}</span>
      </td>
      <td style="padding:14px 0;border-bottom:1px solid #1e1e1e;color:#aaaaaa;font-size:14px;text-align:center;">
        × ${Number(item.quantity)}
      </td>
      <td style="padding:14px 0;border-bottom:1px solid #1e1e1e;color:#fafafa;font-size:14px;text-align:right;white-space:nowrap;">
        ${(Number(item.price) * Number(item.quantity)).toFixed(2).replace('.', ',')} €
      </td>
    </tr>
  `).join('')

  const sa = shipping_address
  const addr2 = sa.line2 ? `${escape(sa.line2)}<br>` : ''

  const html = `<!DOCTYPE html>
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
            <h1 style="margin:0 0 16px;font-size:28px;font-weight:300;color:#fafafa;letter-spacing:0.05em;">Commande reçue</h1>
            <div style="width:40px;height:1px;background:#c9a96e;margin:0 auto 16px;"></div>
            <p style="margin:0;font-size:14px;color:#aaaaaa;line-height:1.6;">
              Merci ${escape(first_name || '')}, votre commande a bien été enregistrée.<br>
              Nous vous contacterons rapidement pour confirmer la livraison.
            </p>
          </td>
        </tr>

        <!-- ARTICLES -->
        <tr>
          <td style="padding:32px 48px 0;">
            <p style="margin:0 0 16px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#c9a96e;">Votre commande</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <th style="padding:0 0 10px;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#555555;font-weight:400;text-align:left;">Produit</th>
                <th style="padding:0 0 10px;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#555555;font-weight:400;text-align:center;">Qté</th>
                <th style="padding:0 0 10px;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#555555;font-weight:400;text-align:right;">Prix</th>
              </tr>
              ${itemsRows}
              <tr>
                <td colspan="2" style="padding:16px 0 0;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:#aaaaaa;">Total</td>
                <td style="padding:16px 0 0;font-size:18px;color:#fafafa;text-align:right;font-weight:500;">${Number(total).toFixed(2).replace('.', ',')} €</td>
              </tr>
              <tr>
                <td colspan="3" style="padding:6px 0 0;font-size:12px;color:#c9a96e;text-align:right;">Livraison offerte</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ADRESSE -->
        <tr>
          <td style="padding:32px 48px;">
            <p style="margin:0 0 16px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#c9a96e;">Adresse de livraison</p>
            <div style="background:#141414;border-left:3px solid #c9a96e;padding:20px 24px;">
              <p style="margin:0;font-size:14px;color:#fafafa;line-height:2;">
                ${escape(sa.first_name)} ${escape(sa.last_name)}<br>
                ${escape(sa.line1)}<br>
                ${addr2}${escape(sa.postal_code)} ${escape(sa.city)}<br>
                <span style="color:#aaaaaa;">${escape(sa.phone)}</span><br>
                <span style="color:#aaaaaa;">${escape(email)}</span>
              </p>
            </div>
          </td>
        </tr>

        <!-- MENTION LÉGALE -->
        <tr>
          <td style="padding:0 48px 32px;">
            <p style="margin:0;font-size:11px;color:#444444;line-height:1.6;">
              Conformément au décret n°2021-1247, tous nos produits contiennent un taux de THC inférieur à 0,3 %.
              Réservé aux personnes majeures.
            </p>
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
</html>`

  const { error } = await resend.emails.send({
    from: 'OMEGACBD <contact@omegacbd.fr>',
    to: [email],
    subject: 'Votre commande OMEGACBD a bien été reçue',
    html,
  })

  if (error) {
    console.error('Resend order-confirm error:', JSON.stringify(error))
    throw createError({ statusCode: 500, message: error.message || 'Erreur envoi email.' })
  }

  await resend.emails.send({
    from: 'OMEGACBD <contact@omegacbd.fr>',
    to: ['jordan-billon@hotmail.fr'],
    subject: `[Nouvelle commande] ${escape(shipping_address?.first_name || first_name || '')} — ${Number(total).toFixed(2).replace('.', ',')} €`,
    html,
  }).catch(e => console.error('Échec mail admin:', e))

  return { success: true }
})
