<template>
  <div class="blog-page">

    <div class="page-hero">
      <p class="page-hero__eyebrow">OMEGACBD</p>
      <h1 class="page-hero__title">Le Blog</h1>
      <div class="page-hero__divider"></div>
      <p class="page-hero__sub">Actualités, réglementation et éducation autour du CBD</p>
    </div>

    <div class="blog-section container">
      <div class="blog-grid">
        <article v-for="post in posts" :key="post.slug" class="blog-card">
          <NuxtLink :to="`/blog/${post.slug}`" class="blog-card__inner">
            <div class="blog-card__header">
              <span class="blog-card__category">{{ post.category }}</span>
              <span class="blog-card__date">{{ formatDate(post.date) }}</span>
            </div>
            <h2 class="blog-card__title">{{ post.title }}</h2>
            <p class="blog-card__desc">{{ post.description }}</p>
            <span class="blog-card__cta">Lire l'article →</span>
          </NuxtLink>
        </article>
      </div>
    </div>

  </div>
</template>

<script setup>
import { posts } from '~/data/posts'

useHead({ title: 'Blog — OMEGACBD' })

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
</script>

<style scoped>
.blog-page {
  padding-top: var(--navbar-height);
  padding-bottom: 80px;
}

.page-hero {
  background: var(--color-surface);
  text-align: center;
  padding: var(--hero-padding-v) 24px;
  transition: background var(--transition);
}

.page-hero__eyebrow {
  font-size: var(--fs-tiny);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 16px;
}

.page-hero__title {
  font-family: var(--font-display);
  font-size: clamp(40px, 6vw, 72px);
  font-weight: 300;
  color: var(--color-text);
  margin-bottom: 20px;
  transition: color var(--transition);
}

.page-hero__divider {
  width: 50px;
  height: 1px;
  background: var(--gold);
  margin: 0 auto 20px;
}

.page-hero__sub {
  font-size: var(--fs-body);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  transition: color var(--transition);
}

.blog-section {
  padding: 80px 24px;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}

.blog-card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  transition: box-shadow var(--transition), transform var(--transition);
}

.blog-card:hover {
  box-shadow: 0 12px 40px rgba(0,0,0,0.1);
  transform: translateY(-4px);
}

.blog-card__inner {
  display: flex;
  flex-direction: column;
  padding: 36px;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

.blog-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.blog-card__category {
  font-size: var(--fs-tiny);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
}

.blog-card__date {
  font-size: var(--fs-tiny);
  letter-spacing: 0.05em;
  color: var(--color-text-subtle);
}

.blog-card__title {
  font-family: var(--font-display);
  font-size: clamp(22px, 2.5vw, 28px);
  font-weight: 400;
  color: var(--color-text);
  margin-bottom: 16px;
  line-height: 1.3;
  transition: color var(--transition);
}

.blog-card:hover .blog-card__title {
  color: var(--gold);
}

.blog-card__desc {
  font-size: var(--fs-small);
  color: var(--color-text-muted);
  line-height: 1.75;
  flex: 1;
  margin-bottom: 24px;
  transition: color var(--transition);
}

.blog-card__cta {
  font-size: var(--fs-tiny);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--gold);
}

@media (max-width: 768px) {
  .blog-grid {
    grid-template-columns: 1fr;
  }
}
</style>
