<template>
  <div class="article-page">

    <div class="breadcrumb container">
      <NuxtLink to="/" class="breadcrumb__link">Accueil</NuxtLink>
      <span class="breadcrumb__sep">›</span>
      <NuxtLink to="/blog" class="breadcrumb__link">Blog</NuxtLink>
      <span class="breadcrumb__sep">›</span>
      <span class="breadcrumb__current">{{ post.title }}</span>
    </div>

    <article class="article container">
      <header class="article__header">
        <div class="article__meta">
          <span class="article__category">{{ post.category }}</span>
          <span class="article__date">{{ formatDate(post.date) }}</span>
        </div>
        <h1 class="article__title">{{ post.title }}</h1>
        <div class="article__divider"></div>
        <p class="article__intro">{{ post.description }}</p>
      </header>

      <div class="article__body prose" v-html="post.content"></div>

      <div class="article__footer">
        <NuxtLink to="/blog" class="article__back">← Retour au blog</NuxtLink>
      </div>
    </article>

  </div>
</template>

<script setup>
const route = useRoute()
const supabase = useSupabaseClient()

const { data: post } = await useAsyncData(`blog-${route.params.slug}`, async () => {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', route.params.slug)
    .eq('published', true)
    .single()
  return data
})

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article introuvable' })
}

useHead({
  title: `${post.value.title} — OMEGACBD`,
  meta: [{ name: 'description', content: post.value.description }]
})

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
</script>

<style scoped>
.article-page {
  padding-top: var(--navbar-height);
  padding-bottom: 80px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px 24px;
  font-size: var(--fs-tiny);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.breadcrumb__link {
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color var(--transition);
}

.breadcrumb__link:hover { color: var(--gold); }
.breadcrumb__sep { color: var(--color-border); }

.breadcrumb__current {
  color: var(--gold);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 240px;
}

.article {
  max-width: 780px;
  padding: 40px 24px 0;
}

.article__header { margin-bottom: 48px; }

.article__meta {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.article__category {
  font-size: var(--fs-tiny);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
}

.article__date {
  font-size: var(--fs-tiny);
  letter-spacing: 0.05em;
  color: var(--color-text-subtle);
}

.article__title {
  font-family: var(--font-display);
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 300;
  color: var(--color-text);
  line-height: 1.15;
  margin-bottom: 20px;
  transition: color var(--transition);
}

.article__divider {
  width: 40px;
  height: 1px;
  background: var(--gold);
  margin-bottom: 20px;
}

.article__intro {
  font-size: var(--fs-body);
  color: var(--color-text-muted);
  line-height: 1.8;
  font-style: italic;
  transition: color var(--transition);
}

.article__body {
  border-top: 1px solid var(--color-border);
  padding-top: 40px;
}

.prose :deep(h2) {
  font-family: var(--font-display);
  font-size: clamp(22px, 3vw, 30px);
  font-weight: 400;
  color: var(--color-text);
  margin: 40px 0 16px;
  transition: color var(--transition);
}

.prose :deep(h3) {
  font-family: var(--font-display);
  font-size: clamp(18px, 2.5vw, 22px);
  font-weight: 400;
  color: var(--color-text);
  margin: 28px 0 12px;
  transition: color var(--transition);
}

.prose :deep(p) {
  font-size: var(--fs-body);
  color: var(--color-text-muted);
  line-height: 1.85;
  margin-bottom: 20px;
  transition: color var(--transition);
}

.prose :deep(strong) {
  color: var(--color-text);
  font-weight: 600;
}

.prose :deep(ul) { margin: 0 0 20px 24px; }

.prose :deep(li) {
  font-size: var(--fs-body);
  color: var(--color-text-muted);
  line-height: 1.75;
  margin-bottom: 8px;
  transition: color var(--transition);
}

.prose :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
}

.prose :deep(th) {
  font-size: var(--fs-tiny);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--gold);
  padding: 10px 16px;
  border-bottom: 1px solid var(--color-border);
  text-align: left;
}

.prose :deep(td) {
  font-size: var(--fs-small);
  color: var(--color-text-muted);
  padding: 10px 16px;
  border-bottom: 1px solid var(--color-border);
  transition: color var(--transition);
}

.article__footer {
  margin-top: 60px;
  padding-top: 32px;
  border-top: 1px solid var(--color-border);
  margin-bottom: 80px;
}

.article__back {
  font-size: var(--fs-tiny);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color var(--transition);
}

.article__back:hover { color: var(--gold); }

@media (max-width: 640px) {
  .article { padding: 24px 16px 0; }
}
</style>
