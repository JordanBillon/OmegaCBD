import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const client = serverSupabaseServiceRole(event) as any
  const { data, error } = await client
    .from('posts')
    .select('*')
    .order('date', { ascending: false })
  if (error) throw createError({ statusCode: 500, message: 'Erreur base de données.' })
  return data
})
