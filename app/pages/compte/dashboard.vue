<template>
  <div class="dashboard-page">

    <div class="page-hero">
      <p class="page-hero__eyebrow">OMEGACBD</p>
      <h1 class="page-hero__title">Mon Compte</h1>
      <div class="page-hero__divider"></div>
      <p class="page-hero__sub">Bienvenue, {{ profile?.first_name || user?.email }}</p>
    </div>

    <div class="dashboard-section container">

      <div class="dashboard-grid">

        <div class="dashboard-card">
          <h2 class="dashboard-card__title">Mes informations</h2>
          <div class="dashboard-info">
            <div class="info-row">
              <span class="info-label">Email</span>
              <span class="info-value">{{ user?.email }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Prénom</span>
              <span class="info-value">{{ profile?.first_name || '—' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Nom</span>
              <span class="info-value">{{ profile?.last_name || '—' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Téléphone</span>
              <span class="info-value">{{ profile?.phone || '—' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Membre depuis</span>
              <span class="info-value">{{ formatDate(profile?.created_at) }}</span>
            </div>
          </div>
        </div>

        <div class="dashboard-card">
          <h2 class="dashboard-card__title">Mes commandes</h2>
          <div v-if="orders.length === 0" class="dashboard-empty">
            <p>Aucune commande pour le moment.</p>
            <NuxtLink to="/produits/cbd" class="dashboard-link">Découvrir nos produits →</NuxtLink>
          </div>
          <div v-else class="orders-list">
            <div v-for="order in orders" :key="order.id" class="order-row">
              <span class="order-id">#{{ order.id.slice(0, 8) }}</span>
              <span class="order-status" :class="order.status">{{ order.status }}</span>
              <span class="order-total">{{ order.total }} €</span>
              <span class="order-date">{{ formatDate(order.created_at) }}</span>
            </div>
          </div>
        </div>

      </div>

      <button class="logout-btn" @click="logout">Se déconnecter</button>

    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const profile = ref(null)
const orders = ref([])

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

const logout = async () => {
  await supabase.auth.signOut()
  router.push('/')
}

onMounted(async () => {
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  if (!currentUser) { router.push('/compte/connexion'); return }

  const { data: p } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single()
  profile.value = p

  const { data: o } = await supabase.from('orders').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false })
  orders.value = o || []
})
</script>

<style scoped>
.dashboard-page {
  padding-top: var(--navbar-height);
}

.page-hero {
  background: var(--color-surface);
  text-align: center;
  padding: 80px 24px;
  transition: background var(--transition);
}

.page-hero__eyebrow {
  font-size: 10px;
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
}

.page-hero__divider {
  width: 50px;
  height: 1px;
  background: var(--gold);
  margin: 0 auto 20px;
}

.page-hero__sub {
  font-size: 14px;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
}

.dashboard-section {
  padding: 60px 24px 100px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 32px;
  margin-bottom: 48px;
}

.dashboard-card {
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  padding: 32px;
  transition: background var(--transition);
}

.dashboard-card__title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 400;
  color: var(--color-text);
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
}

.info-value {
  font-size: 14px;
  color: var(--color-text);
}

.dashboard-empty {
  text-align: center;
  padding: 32px 0;
}

.dashboard-empty p {
  font-size: 14px;
  color: var(--color-text-muted);
  margin-bottom: 16px;
}

.dashboard-link {
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gold);
}

.order-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 13px;
  color: var(--color-text);
}

.order-status {
  text-transform: uppercase;
  font-size: 10px;
  letter-spacing: 0.1em;
}

.order-status.paid { color: #48bb78; }
.order-status.pending { color: var(--gold); }
.order-status.cancelled { color: #e53e3e; }
.order-status.shipped { color: #4299e1; }

.logout-btn {
  padding: 12px 32px;
  border: 1px solid var(--color-border);
  background: none;
  color: var(--color-text-muted);
  font-family: var(--font-body);
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all var(--transition);
}

.logout-btn:hover {
  border-color: #e53e3e;
  color: #e53e3e;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
