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

  const { error } = await resend.emails.send({
    from: 'OMEGACBD <contact@omegacbd.fr>',
    to: ['jordan-billon@hotmail.fr'],
    replyTo: email,
    subject: `[Contact] ${sujets[sujet] || 'Nouveau message'} — ${escape(prenom)} ${escape(nom)}`,
    html: `
      <h2>Nouveau message de contact</h2>
      <p><strong>Nom :</strong> ${escape(prenom)} ${escape(nom)}</p>
      <p><strong>Email :</strong> ${escape(email)}</p>
      <p><strong>Sujet :</strong> ${sujets[sujet] || '—'}</p>
      <hr />
      <p>${escape(message).replace(/\n/g, '<br>')}</p>
    `,
  })

  if (error) {
    console.error('Resend error:', JSON.stringify(error))
    throw createError({ statusCode: 500, message: error.message || 'Erreur envoi email.' })
  }

  return { success: true }
})
