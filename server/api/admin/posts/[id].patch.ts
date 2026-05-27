import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const client = serverSupabaseServiceRole(event) as any
  const { data, error } = await client
    .from('posts')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, message: 'Erreur mise à jour.' })
  return data
})
