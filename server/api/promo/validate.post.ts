import { serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'

const requests = new Map<string, number>()

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Non authentifié.' })
  }

  const ip = (getRequestHeader(event, 'x-forwarded-for') || 'unknown').split(',')[0]?.trim() ?? 'unknown'
  const now = Date.now()
  if ((requests.get(ip) || 0) > now - 10_000) {
    throw createError({ statusCode: 429, message: 'Trop de requêtes. Attendez quelques secondes.' })
  }
  requests.set(ip, now)
  if (requests.size > 10_000) {
    const cutoff = now - 60_000
    for (const [k, v] of requests) {
      if (v < cutoff) requests.delete(k)
    }
  }

  const { code } = await readBody(event)
  if (!code || typeof code !== 'string' || code.trim().length === 0 || code.length > 50) {
    throw createError({ statusCode: 400, message: 'Code invalide.' })
  }

  const client = serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('promo_codes')
    .select('code, discount_type, discount_value, max_uses, uses, expires_at, active')
    .eq('code', code.trim().toUpperCase())
    .single()

  if (error || !data) {
    throw createError({ statusCode: 404, message: 'Code promo introuvable.' })
  }
  if (!data.active) {
    throw createError({ statusCode: 400, message: 'Ce code promo n\'est plus actif.' })
  }
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    throw createError({ statusCode: 400, message: 'Ce code promo a expiré.' })
  }
  if (data.max_uses !== null && data.uses >= data.max_uses) {
    throw createError({ statusCode: 400, message: 'Ce code promo a atteint sa limite d\'utilisation.' })
  }

  return {
    code: data.code,
    discount_type: data.discount_type as 'percent' | 'fixed',
    discount_value: Number(data.discount_value)
  }
})
