import { serverSupabaseServiceRole } from '#supabase/server'

const VALID_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const updates: Record<string, any> = {}
  if (body.status !== undefined) {
    if (!VALID_STATUSES.includes(body.status)) {
      throw createError({ statusCode: 400, message: 'Statut invalide.' })
    }
    updates.status = body.status
  }
  if (body.tracking_number !== undefined) {
    updates.tracking_number = String(body.tracking_number).slice(0, 100) || null
  }
  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, message: 'Aucune modification.' })
  }

  const client = serverSupabaseServiceRole(event) as any
  const { error } = await client.from('orders').update(updates).eq('id', id)
  if (error) throw createError({ statusCode: 500, message: 'Erreur mise à jour.' })
  return { success: true }
})
