<template>
  <NuxtLayout>
  <div class="error-page">
    <div class="error-page__inner">
      <p class="error-page__eyebrow">OMEGACBD</p>
      <h1 class="error-page__code">404</h1>
      <div class="error-page__divider"></div>
      <p class="error-page__title">Page introuvable</p>
      <p class="error-page__sub">La page que vous recherchez n'existe pas ou a été déplacée.</p>
      <NuxtLink to="/" class="error-btn">Retour à l'accueil</NuxtLink>
    </div>
  </div>
  </NuxtLayout>
</template>

<script setup>
defineProps({ error: Object })
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  text-align: center;
  padding: 40px 24px;
}

.error-page__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.error-page__eyebrow {
  font-family: var(--font-body);
  font-size: var(--fs-label);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
}

.error-page__code {
  font-family: var(--font-display);
  font-size: clamp(80px, 15vw, 160px);
  font-weight: 300;
  color: var(--color-text);
  line-height: 1;
}

.error-page__divider {
  width: 40px;
  height: 1px;
  background: var(--gold);
}

.error-page__title {
  font-family: var(--font-display);
  font-size: clamp(20px, 4vw, 28px);
  font-weight: 400;
  color: var(--color-text);
}

.error-page__sub {
  font-family: var(--font-body);
  font-size: var(--fs-body);
  color: var(--color-text-muted);
  max-width: 360px;
}

.error-btn {
  display: inline-block;
  padding: 14px 32px;
  font-family: var(--font-body);
  font-size: var(--fs-label);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: var(--color-text);
  color: var(--color-bg);
  transition: all var(--transition);
}

.error-btn:hover {
  background: var(--gold);
  color: var(--white);
}
</style>
