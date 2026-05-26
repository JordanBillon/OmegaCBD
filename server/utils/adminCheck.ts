import { serverSupabaseUser } from '#supabase/server'

export async function requireAdmin(event: any) {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Non authentifié.' })
  const config = useRuntimeConfig(event)
  if (!config.adminEmail || user.email !== config.adminEmail) {
    throw createError({ statusCode: 403, message: 'Accès refusé.' })
  }
  return user
}
