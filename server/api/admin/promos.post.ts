import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const { code, discount_type, discount_value, max_uses, expires_at } = await readBody(event)

  if (!code || !discount_type || !discount_value) {
    throw createError({ statusCode: 400, message: 'Champs obligatoires manquants.' })
  }
  if (!['percent', 'fixed'].includes(discount_type)) {
    throw createError({ statusCode: 400, message: 'Type invalide.' })
  }
  if (Number(discount_value) <= 0) {
    throw createError({ statusCode: 400, message: 'La valeur doit être supérieure à 0.' })
  }
  if (discount_type === 'percent' && Number(discount_value) > 100) {
    throw createError({ statusCode: 400, message: 'Le pourcentage ne peut pas dépasser 100.' })
  }

  const client = serverSupabaseServiceRole(event) as any
  const { data, error } = await client
    .from('promo_codes')
    .insert({
      code: String(code).trim().toUpperCase().slice(0, 50),
      discount_type,
      discount_value: Number(discount_value),
      max_uses: max_uses ? Number(max_uses) : null,
      expires_at: expires_at || null,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') throw createError({ statusCode: 409, message: 'Ce code existe déjà.' })
    throw createError({ statusCode: 500, message: 'Erreur création.' })
  }
  return data
})
