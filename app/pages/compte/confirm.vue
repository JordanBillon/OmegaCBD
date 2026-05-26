<template>
  <div class="auth-page">
    <div class="page-hero">
      <p class="page-hero__eyebrow">OMEGACBD</p>
      <h1 class="page-hero__title">{{ title }}</h1>
      <div class="page-hero__divider"></div>
      <p class="page-hero__sub">{{ message }}</p>
      <NuxtLink v-if="ready" to="/compte/dashboard" class="confirm-btn">
        Accéder à mon compte →
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const title = ref('Vérification…')
const message = ref('Merci de patienter quelques instants.')
const ready = ref(false)

onMounted(async () => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
    if (event === 'USER_UPDATED' || event === 'SIGNED_IN') {
      const isEmailChange = window.location.hash.includes('type=email_change')
        || new URLSearchParams(window.location.search).get('type') === 'email_change'
      title.value = isEmailChange ? 'Email mis à jour !' : 'Compte confirmé !'
      message.value = isEmailChange
        ? 'Votre nouvelle adresse email est désormais active.'
        : 'Votre compte est activé et prêt à être utilisé.'
      ready.value = true
      subscription.unsubscribe()
    }
  })

  // Fallback si l'event ne se déclenche pas (token déjà traité)
  await new Promise(r => setTimeout(r, 3000))
  if (!ready.value) {
    title.value = 'Confirmation'
    message.value = 'Opération effectuée.'
    ready.value = true
  }
})
</script>

<style scoped>
.auth-page { padding-top: var(--navbar-height); }
.page-hero {
  background: var(--color-surface);
  text-align: center;
  padding: 120px 24px;
  transition: background var(--transition);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.page-hero__eyebrow {
  font-size: var(--fs-tiny); letter-spacing: 0.3em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 16px;
}
.page-hero__title {
  font-family: var(--font-display); font-size: clamp(40px, 6vw, 72px);
  font-weight: 300; color: var(--color-text); margin-bottom: 20px;
}
.page-hero__divider { width: 50px; height: 1px; background: var(--gold); margin: 0 auto 20px; }
.page-hero__sub { font-size: var(--fs-body); color: var(--color-text-muted); margin-bottom: 32px; }
.confirm-btn {
  display: inline-block;
  padding: 14px 32px;
  border: 1px solid var(--gold);
  background: var(--gold);
  color: #0a0a0a;
  font-family: var(--font-body);
  font-size: var(--fs-label);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-decoration: none;
  transition: all var(--transition);
}
.confirm-btn:hover { background: transparent; color: var(--gold); }
</style>
