<template>
  <div class="auth-page">
    <div class="page-hero">
      <p class="page-hero__eyebrow">OMEGACBD</p>
      <h1 class="page-hero__title">Confirmation</h1>
      <div class="page-hero__divider"></div>
      <p class="page-hero__sub">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()
const message = ref('Vérification en cours...')

onMounted(async () => {
  await new Promise(r => setTimeout(r, 1500))
  message.value = 'Compte confirmé ! Redirection...'
  setTimeout(() => router.push('/compte/dashboard'), 1000)
})
</script>

<style scoped>
.auth-page { padding-top: var(--navbar-height); }
.page-hero {
  background: var(--color-surface);
  text-align: center;
  padding: 120px 24px;
  transition: background var(--transition);
}
.page-hero__eyebrow {
  font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 16px;
}
.page-hero__title {
  font-family: var(--font-display); font-size: clamp(40px, 6vw, 72px);
  font-weight: 300; color: var(--color-text); margin-bottom: 20px;
}
.page-hero__divider { width: 50px; height: 1px; background: var(--gold); margin: 0 auto 20px; }
.page-hero__sub { font-size: 14px; color: var(--color-text-muted); }
</style>
