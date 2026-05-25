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
          <div v-if="!loadingOrders && orders.length === 0" class="dashboard-empty">
            <p>Aucune commande pour le moment.</p>
            <NuxtLink to="/produits/cbd" class="dashboard-link">Découvrir nos produits →</NuxtLink>
          </div>
          <div v-else-if="!loadingOrders" class="orders-list">
            <div class="order-row order-row--header">
              <span>Référence</span>
              <span>Statut</span>
              <span>Montant</span>
              <span>Date</span>
              <span></span>
            </div>
            <div v-for="order in orders" :key="order.id" class="order-item">
              <div class="order-row order-row--clickable" @click="toggleOrder(order.id)">
                <span class="order-id">#{{ order.id.slice(0, 8) }}</span>
                <span class="order-status" :class="order.status">{{ order.status }}</span>
                <span class="order-total">{{ Number(order.total).toFixed(2).replace('.', ',') }} €</span>
                <span class="order-date">{{ formatDate(order.created_at) }}</span>
                <span class="order-chevron" :class="{ open: expandedOrder === order.id }">›</span>
              </div>
              <div v-if="expandedOrder === order.id" class="order-details">
                <div v-for="item in order.items" :key="`${item.productId}-${item.weight}`" class="order-detail-row">
                  <span class="detail-name">{{ item.name }}</span>
                  <span class="detail-weight">{{ item.weight }}</span>
                  <span class="detail-qty">× {{ item.quantity }}</span>
                  <span class="detail-price">{{ (item.price * item.quantity).toFixed(2).replace('.', ',') }} €</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="logout-wrapper">
        <button class="logout-btn" @click="logout">Se déconnecter</button>
      </div>

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
const expandedOrder = ref(null)
const loadingOrders = ref(true)

const toggleOrder = (id) => {
  expandedOrder.value = expandedOrder.value === id ? null : id
}

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
  loadingOrders.value = false
})
</script>

<style scoped>
.dashboard-page {
  padding-top: var(--navbar-height);
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
}

.page-hero__divider {
  width: 50px;
  height: 1px;
  background: var(--gold);
  margin: 0 auto 20px;
}

.page-hero__sub {
  font-size: var(--fs-body);
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
  font-size: var(--fs-tiny);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
}

.info-value {
  font-size: var(--fs-body);
  color: var(--color-text);
}

.dashboard-empty {
  text-align: center;
  padding: 32px 0;
}

.dashboard-empty p {
  font-size: var(--fs-body);
  color: var(--color-text-muted);
  margin-bottom: 16px;
}

.dashboard-link {
  font-size: var(--fs-xs);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gold);
}

.order-item {
  border-bottom: 1px solid var(--color-border);
}

.order-item:last-child {
  border-bottom: none;
}

.order-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr auto;
  gap: 16px;
  padding: 12px 0;
  font-size: var(--fs-small);
  color: var(--color-text);
}

.order-row--clickable {
  cursor: pointer;
  transition: color var(--transition);
}

.order-row--clickable:hover {
  background: var(--color-surface);
}

.order-chevron {
  font-size: 18px;
  color: var(--color-text-subtle);
  transition: transform 0.2s ease;
  display: inline-block;
}

.order-chevron.open {
  transform: rotate(90deg);
}

.order-details {
  padding: 8px 0 16px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.order-detail-row {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 16px;
  padding: 8px 12px;
  background: var(--color-surface);
  font-size: var(--fs-small);
  color: var(--color-text-muted);
}

.detail-name {
  color: var(--color-text);
}

.detail-weight {
  font-size: var(--fs-label);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
}

.detail-qty {
  color: var(--color-text-subtle);
}

.detail-price {
  color: var(--color-text);
  font-family: var(--font-display);
}

.order-row--header {
  font-size: var(--fs-tiny);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
  border-bottom: 1px solid var(--color-border);
}

.order-status {
  text-transform: uppercase;
  font-size: var(--fs-tiny);
  letter-spacing: 0.1em;
}

.order-status.paid { color: #48bb78; }
.order-status.pending { color: var(--gold); }
.order-status.cancelled { color: #e53e3e; }
.order-status.shipped { color: #4299e1; }

.logout-wrapper {
  display: flex;
  justify-content: center;
}

.logout-btn {
  padding: 12px 32px;
  border: 1px solid var(--color-border);
  background: var(--color-text);
  color: var(--color-bg);
  font-family: var(--font-body);
  font-size: var(--fs-label);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all var(--transition);
}

.logout-btn:hover {
  border-color: #e53e3e;
  color: #e53e3e;
}

@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 400px) {
  .dashboard-card {
    padding: 20px 16px;
  }

  .order-row--header {
    display: none;
  }

  .order-row {
    grid-template-columns: 1fr 1fr auto;
    grid-template-areas: "ref status chev" "total date chev";
    gap: 16px 12px;
    padding: 16px 12px;
  }

  .order-id     { grid-area: ref; }
  .order-status  { grid-area: status; }
  .order-total   { grid-area: total; }
  .order-date    { grid-area: date; }
  .order-chevron { grid-area: chev; align-self: center; }

  .order-id::before,
  .order-status::before,
  .order-total::before,
  .order-date::before {
    display: block;
    font-size: var(--fs-tiny);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text-subtle);
    padding-bottom: 5px;
    margin-bottom: 6px;
    border-bottom: 1px solid var(--color-border);
  }

  .order-id::before     { content: 'Référence'; }
  .order-status::before  { content: 'Statut'; }
  .order-total::before   { content: 'Montant'; }
  .order-date::before    { content: 'Date'; }

  .order-detail-row {
    grid-template-columns: 1fr auto auto;
  }

  .detail-weight {
    display: none;
  }
}
</style>
