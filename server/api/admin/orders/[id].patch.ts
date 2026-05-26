import { Resend } from 'resend'
import { serverSupabaseServiceRole } from '#supabase/server'

const VALID_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

const escape = (str: string) => String(str)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const updates: Record<string, any> = {}

  if (body.status !== undefined) {
    if (!VALID_STATUSES.includes(body.status)) {
      throw createError({ statusCode: 400, message: 'Statut invalide.' })
    }
    if (body.status === 'shipped' && !String(body.tracking_number || '').trim()) {
      throw createError({ statusCode: 400, message: 'Le numéro de suivi est requis pour passer en expédié.' })
    }
    updates.status = body.status
  }

  if (body.tracking_number !== undefined) {
    updates.tracking_number = body.tracking_number ? String(body.tracking_number).slice(0, 100) : null
  }

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, message: 'Aucune modification.' })
  }

  const client = serverSupabaseServiceRole(event) as any
  const { error } = await client.from('orders').update(updates).eq('id', id)
  if (error) throw createError({ statusCode: 500, message: 'Erreur mise à jour.' })

  if (updates.status === 'shipped' && updates.tracking_number && body.send_email === true) {
    sendShippingEmail(event, client, id, updates.tracking_number).catch(e =>
      console.error('Échec mail expédition:', e)
    )
  }

  return { success: true }
})

async function sendShippingEmail(event: any, client: any, orderId: string, trackingNumber: string) {
  const { data: orderData } = await client
    .from('orders')
    .select('items, total, shipping_address, promo_code, discount, user_id')
    .eq('id', orderId)
    .single()

  if (!orderData?.shipping_address) return

  const { data: userData } = await client.auth.admin.getUserById(orderData.user_id)
  const userEmail = userData?.user?.email
  if (!userEmail) return

  const { resendApiKey } = useRuntimeConfig(event)
  const resend = new Resend(resendApiKey as string)

  const sa = orderData.shipping_address
  const items = orderData.items || []
  const total = orderData.total
  const promoCode = orderData.promo_code
  const discount = orderData.discount

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

  const addr2 = sa.line2 ? `${escape(sa.line2)}<br>` : ''
  const promoRow = promoCode && Number(discount) > 0 ? `
    <tr>
      <td colspan="2" style="padding:12px 0 0;font-size:12px;letter-spacing:0.1em;color:#aaaaaa;">Code ${escape(promoCode)}</td>
      <td style="padding:12px 0 0;font-size:14px;color:#c9a96e;text-align:right;">− ${Number(discount).toFixed(2).replace('.', ',')} €</td>
    </tr>` : ''
  const totalPad = promoCode ? '8' : '16'

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0a0a0a;border-radius:2px;overflow:hidden;">

        <tr>
          <td style="background:#0a0a0a;padding:40px 48px 32px;text-align:center;border-bottom:1px solid #2a2a2a;">
            <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#c9a96e;">OMEGACBD</p>
            <h1 style="margin:0 0 16px;font-size:28px;font-weight:300;color:#fafafa;letter-spacing:0.05em;">Votre commande est en route !</h1>
            <div style="width:40px;height:1px;background:#c9a96e;margin:0 auto 16px;"></div>
            <p style="margin:0;font-size:14px;color:#aaaaaa;line-height:1.6;">
              ${escape(sa.first_name)}, votre commande a été expédiée.<br>
              Utilisez le numéro ci-dessous pour suivre votre colis.
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:32px 48px 0;">
            <p style="margin:0 0 12px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#c9a96e;">Numéro de suivi</p>
            <div style="background:#141414;border-left:3px solid #c9a96e;padding:20px 24px;text-align:center;">
              <p style="margin:0;font-size:20px;font-weight:500;color:#c9a96e;letter-spacing:0.15em;font-family:monospace;">${escape(trackingNumber)}</p>
            </div>
          </td>
        </tr>

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
              ${promoRow}
              <tr>
                <td colspan="2" style="padding:${totalPad}px 0 0;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:#aaaaaa;">Total</td>
                <td style="padding:${totalPad}px 0 0;font-size:18px;color:#fafafa;text-align:right;font-weight:500;">${Number(total).toFixed(2).replace('.', ',')} €</td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:32px 48px;">
            <p style="margin:0 0 16px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#c9a96e;">Adresse de livraison</p>
            <div style="background:#141414;border-left:3px solid #c9a96e;padding:20px 24px;">
              <p style="margin:0;font-size:14px;color:#fafafa;line-height:2;">
                ${escape(sa.first_name)} ${escape(sa.last_name)}<br>
                ${escape(sa.line1)}<br>
                ${addr2}${escape(sa.postal_code)} ${escape(sa.city)}<br>
                <span style="color:#aaaaaa;">${escape(sa.phone)}</span>
              </p>
            </div>
          </td>
        </tr>

        <tr>
          <td style="padding:0 48px 32px;">
            <p style="margin:0;font-size:11px;color:#444444;line-height:1.6;">
              Conformément au décret n°2021-1247, tous nos produits contiennent un taux de THC inférieur à 0,3 %.
              Réservé aux personnes majeures.
            </p>
          </td>
        </tr>

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

  await resend.emails.send({
    from: 'OMEGACBD <contact@omegacbd.fr>',
    to: [userEmail],
    subject: 'Votre commande OMEGACBD est en route !',
    html,
  })
}
