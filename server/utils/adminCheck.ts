import { serverSupabaseUser } from '#supabase/server'

export async function requireAdmin(event: any) {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Non authentifié.' })
  const config = useRuntimeConfig(event)
  const adminEmails = String(config.adminEmail || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
  if (!adminEmails.includes(user.email!.toLowerCase())) {
    throw createError({ statusCode: 403, message: 'Accès refusé.' })
  }
  return user
}
