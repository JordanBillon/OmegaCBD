import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const { title, slug, description, category, content, raw_content, date, published } = await readBody(event)

  if (!title?.trim() || !slug?.trim() || !description?.trim()) {
    throw createError({ statusCode: 400, message: 'Titre, slug et description sont obligatoires.' })
  }

  const client = serverSupabaseServiceRole(event) as any
  const { data, error } = await client
    .from('posts')
    .insert({
      title: title.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      description: description.trim(),
      category: category?.trim() || 'Article',
      content: content || '',
      raw_content: raw_content || '',
      date: date || new Date().toISOString().slice(0, 10),
      published: published ?? true,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') throw createError({ statusCode: 409, message: 'Ce slug existe déjà.' })
    throw createError({ statusCode: 500, message: 'Erreur création.' })
  }
  return data
})
