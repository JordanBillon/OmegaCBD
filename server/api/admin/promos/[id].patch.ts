import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  const { active } = await readBody(event)

  if (typeof active !== 'boolean') {
    throw createError({ statusCode: 400, message: 'Valeur invalide.' })
  }

  const client = serverSupabaseServiceRole(event) as any
  const { error } = await client.from('promo_codes').update({ active }).eq('id', id)
  if (error) throw createError({ statusCode: 500, message: 'Erreur mise à jour.' })
  return { success: true }
})
