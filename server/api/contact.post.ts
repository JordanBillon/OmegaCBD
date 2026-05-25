import { Resend } from 'resend'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { nom, prenom, email, sujet, message, age, honeypot } = body

  if (honeypot) return { success: true }

  if (!nom || !prenom || !email || !message || !age) {
    throw createError({ statusCode: 400, message: 'Champs manquants.' })
  }

  const config = useRuntimeConfig()
  const resend = new Resend(config.resendApiKey)

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
    subject: `[Contact] ${sujets[sujet] || 'Nouveau message'} — ${prenom} ${nom}`,
    html: `
      <h2>Nouveau message de contact</h2>
      <p><strong>Nom :</strong> ${prenom} ${nom}</p>
      <p><strong>Email :</strong> ${email}</p>
      <p><strong>Sujet :</strong> ${sujets[sujet] || '—'}</p>
      <hr />
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  })

  if (error) throw createError({ statusCode: 500, message: error.message || 'Erreur envoi email.' })

  return { success: true }
})
