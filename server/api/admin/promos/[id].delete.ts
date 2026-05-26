import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  const client = serverSupabaseServiceRole(event) as any
  const { error } = await client.from('promo_codes').delete().eq('id', id)
  if (error) throw createError({ statusCode: 500, message: 'Erreur suppression.' })
  return { success: true }
})
