<template>
  <div class="admin-page">

    <div class="page-hero">
      <p class="page-hero__eyebrow">OMEGACBD</p>
      <h1 class="page-hero__title">Administration</h1>
      <div class="page-hero__divider"></div>
      <p class="page-hero__sub">{{ orders.length }} commande{{ orders.length !== 1 ? 's' : '' }} · {{ promos.length }} code{{ promos.length !== 1 ? 's' : '' }} promo</p>
    </div>

    <div class="admin-tabs-bar">
      <div class="container">
        <button class="admin-tab" :class="{ active: tab === 'orders' }" @click="tab = 'orders'">
          Commandes <span class="tab-count">{{ orders.length }}</span>
        </button>
        <button class="admin-tab" :class="{ active: tab === 'promos' }" @click="tab = 'promos'">
          Codes promo <span class="tab-count">{{ promos.length }}</span>
        </button>
      </div>
    </div>

    <!-- COMMANDES -->
    <div v-if="tab === 'orders'" class="admin-section container">
      <div v-if="loadingOrders" class="admin-loading">Chargement…</div>
      <div v-else-if="orders.length === 0" class="admin-empty">Aucune commande pour le moment.</div>
      <div v-else class="orders-wrap">
        <div class="orders-table">
          <div class="orow orow--head">
            <span>Référence</span>
            <span>Client</span>
            <span>Statut</span>
            <span>Total</span>
            <span>Date</span>
            <span>N° de suivi</span>
            <span></span>
          </div>
          <div v-for="order in orders" :key="order.id" class="order-item">
            <div class="orow orow--data" @click="toggleOrder(order.id)">
              <span class="col-ref">#{{ order.id.slice(0, 8) }}</span>
              <span class="col-client">{{ order.shipping_address?.first_name }} {{ order.shipping_address?.last_name }}</span>
              <span class="col-status" @click.stop>
                <select
                  class="status-select"
                  :class="`s-${order.status}`"
                  :value="order.status"
                  @change="updateStatus(order, $event.target.value)"
                >
                  <option value="pending">En attente</option>
                  <option value="paid">Payé</option>
                  <option value="shipped">Expédié</option>
                  <option value="delivered">Livré</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </span>
              <span class="col-total">{{ Number(order.total).toFixed(2).replace('.', ',') }} €</span>
              <span class="col-date">{{ formatDate(order.created_at) }}</span>
              <span class="col-tracking" @click.stop>
                <div class="tracking-row">
                  <input
                    v-model="trackingInputs[order.id]"
                    class="tracking-input"
                    type="text"
                    placeholder="Ajouter…"
                    @keyup.enter="saveTracking(order)"
                  />
                  <button class="tracking-save" :disabled="savingTracking[order.id]" @click="saveTracking(order)">
                    {{ savingTracking[order.id] ? '…' : 'OK' }}
                  </button>
                </div>
              </span>
              <span class="col-chev" :class="{ open: expandedOrder === order.id }">›</span>
            </div>

            <div v-if="expandedOrder === order.id" class="order-details">
              <div v-for="item in order.items" :key="`${item.productId}-${item.weight}`" class="detail-row">
                <span class="detail-name">{{ item.name }}</span>
                <span class="detail-weight">{{ item.weight }}</span>
                <span class="detail-qty">× {{ item.quantity }}</span>
                <span class="detail-price">{{ (item.price * item.quantity).toFixed(2).replace('.', ',') }} €</span>
              </div>
              <div v-if="order.promo_code && Number(order.discount) > 0" class="detail-promo">
                <span>Code {{ order.promo_code }}</span>
                <span class="detail-promo__saving">− {{ Number(order.discount).toFixed(2).replace('.', ',') }} €</span>
              </div>
              <div v-if="order.shipping_address" class="order-address">
                <p class="address-title">Livraison</p>
                <p class="address-line">{{ order.shipping_address.first_name }} {{ order.shipping_address.last_name }}</p>
                <p class="address-line">{{ order.shipping_address.line1 }}<template v-if="order.shipping_address.line2">, {{ order.shipping_address.line2 }}</template></p>
                <p class="address-line">{{ order.shipping_address.postal_code }} {{ order.shipping_address.city }}</p>
                <p class="address-line">{{ order.shipping_address.phone }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CODES PROMO -->
    <div v-if="tab === 'promos'" class="admin-section container">

      <div class="promo-create-card">
        <h2 class="create-title">Nouveau code promo</h2>
        <div class="create-form">
          <div class="create-field">
            <label class="create-label">Code *</label>
            <input v-model="createForm.code" class="create-input" type="text" placeholder="OMEGA10" maxlength="50" />
          </div>
          <div class="create-field">
            <label class="create-label">Type *</label>
            <select v-model="createForm.discount_type" class="create-input create-select">
              <option value="percent">Pourcentage (%)</option>
              <option value="fixed">Fixe (€)</option>
            </select>
          </div>
          <div class="create-field">
            <label class="create-label">Valeur *</label>
            <input v-model="createForm.discount_value" class="create-input" type="number" min="0.01" :max="createForm.discount_type === 'percent' ? 100 : undefined" placeholder="10" />
          </div>
          <div class="create-field">
            <label class="create-label">Limite d'utilisations</label>
            <input v-model="createForm.max_uses" class="create-input" type="number" min="1" placeholder="Illimité" />
          </div>
          <div class="create-field">
            <label class="create-label">Expiration</label>
            <input v-model="createForm.expires_at" class="create-input" type="date" />
          </div>
          <div class="create-field create-field--btn">
            <button
              class="create-btn"
              :disabled="creating || !createForm.code.trim() || !createForm.discount_value"
              @click="createPromo"
            >
              {{ creating ? 'Création…' : 'Créer' }}
            </button>
          </div>
        </div>
        <p v-if="createError" class="create-error">{{ createError }}</p>
        <p v-if="createSuccess" class="create-success">Code créé avec succès.</p>
      </div>

      <div v-if="promos.length > 0" class="promos-table">
        <div class="prow prow--head">
          <span>Code</span>
          <span>Type</span>
          <span>Réduction</span>
          <span>Utilisations</span>
          <span>Expiration</span>
          <span>Statut</span>
        </div>
        <div v-for="promo in promos" :key="promo.id" class="prow" :class="{ inactive: !promo.active }">
          <span class="pcol-code">{{ promo.code }}</span>
          <span class="pcol-type">{{ promo.discount_type === 'percent' ? 'Pourcentage' : 'Fixe' }}</span>
          <span class="pcol-value">{{ promo.discount_type === 'percent' ? `${promo.discount_value} %` : `${Number(promo.discount_value).toFixed(2).replace('.', ',')} €` }}</span>
          <span class="pcol-uses">{{ promo.uses }}{{ promo.max_uses ? ` / ${promo.max_uses}` : '' }}</span>
          <span class="pcol-exp">{{ promo.expires_at ? formatDate(promo.expires_at) : 'Sans limite' }}</span>
          <span class="pcol-toggle">
            <button
              class="toggle-btn"
              :class="{ 'toggle-btn--on': promo.active }"
              :disabled="togglingPromo[promo.id]"
              @click="togglePromo(promo)"
            >
              {{ promo.active ? 'Actif' : 'Inactif' }}
            </button>
          </span>
        </div>
      </div>
      <div v-else-if="!loadingPromos" class="admin-empty">Aucun code promo.</div>

    </div>

  </div>
</template>

<script setup>
definePageMeta({ middleware: 'admin' })

const tab = ref('orders')

const orders = ref([])
const promos = ref([])
const loadingOrders = ref(true)
const loadingPromos = ref(true)
const expandedOrder = ref(null)
const trackingInputs = ref({})
const savingTracking = ref({})
const togglingPromo = ref({})

const createForm = reactive({
  code: '',
  discount_type: 'percent',
  discount_value: '',
  max_uses: '',
  expires_at: ''
})
const createError = ref('')
const createSuccess = ref(false)
const creating = ref(false)

const toggleOrder = (id) => {
  expandedOrder.value = expandedOrder.value === id ? null : id
}

const updateStatus = async (order, status) => {
  const prev = order.status
  order.status = status
  try {
    await $fetch(`/api/admin/orders/${order.id}`, { method: 'PATCH', body: { status } })
  } catch {
    order.status = prev
  }
}

const saveTracking = async (order) => {
  savingTracking.value[order.id] = true
  try {
    const tracking_number = trackingInputs.value[order.id] || null
    await $fetch(`/api/admin/orders/${order.id}`, { method: 'PATCH', body: { tracking_number } })
    order.tracking_number = tracking_number
  } catch {
    // silencieux
  } finally {
    savingTracking.value[order.id] = false
  }
}

const togglePromo = async (promo) => {
  togglingPromo.value[promo.id] = true
  const newActive = !promo.active
  try {
    await $fetch(`/api/admin/promos/${promo.id}`, { method: 'PATCH', body: { active: newActive } })
    promo.active = newActive
  } catch {
    // silencieux
  } finally {
    togglingPromo.value[promo.id] = false
  }
}

const createPromo = async () => {
  createError.value = ''
  creating.value = true
  try {
    const newPromo = await $fetch('/api/admin/promos', {
      method: 'POST',
      body: {
        code: createForm.code,
        discount_type: createForm.discount_type,
        discount_value: createForm.discount_value,
        max_uses: createForm.max_uses || null,
        expires_at: createForm.expires_at || null
      }
    })
    promos.value.unshift(newPromo)
    Object.assign(createForm, { code: '', discount_type: 'percent', discount_value: '', max_uses: '', expires_at: '' })
    createSuccess.value = true
    setTimeout(() => { createSuccess.value = false }, 2500)
  } catch (e) {
    createError.value = e.data?.message || 'Erreur lors de la création.'
  } finally {
    creating.value = false
  }
}

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(async () => {
  try {
    const [o, p] = await Promise.all([
      $fetch('/api/admin/orders'),
      $fetch('/api/admin/promos')
    ])
    orders.value = o || []
    promos.value = p || []
    for (const order of orders.value) {
      trackingInputs.value[order.id] = order.tracking_number || ''
    }
  } catch (e) {
    if (e?.status === 401 || e?.status === 403) {
      navigateTo('/')
      return
    }
  } finally {
    loadingOrders.value = false
    loadingPromos.value = false
  }
})
</script>

<style scoped>
.admin-page {
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
  color: var(--color-text-muted);
}

.admin-tabs-bar {
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg);
  transition: background var(--transition);
}

.admin-tabs-bar .container {
  display: flex;
  gap: 0;
}

.admin-tab {
  padding: 16px 28px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-family: var(--font-body);
  font-size: var(--fs-label);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition);
  margin-bottom: -1px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.admin-tab:hover {
  color: var(--color-text);
}

.admin-tab.active {
  color: var(--gold);
  border-bottom-color: var(--gold);
}

.tab-count {
  background: var(--color-surface);
  color: var(--color-text-muted);
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
}

.admin-section {
  padding: 40px 24px 80px;
}

.admin-loading,
.admin-empty {
  text-align: center;
  padding: 60px 0;
  font-size: var(--fs-body);
  color: var(--color-text-muted);
}

/* ── ORDERS ── */

.orders-wrap {
  overflow-x: auto;
}

.orders-table {
  min-width: 900px;
}

.orow {
  display: grid;
  grid-template-columns: 90px 1fr 130px 80px 90px 1fr 24px;
  gap: 12px;
  padding: 12px 8px;
  align-items: center;
}

.orow--head {
  font-size: var(--fs-tiny);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 10px;
}

.orow--data {
  cursor: pointer;
  border-bottom: 1px solid var(--color-border);
  font-size: var(--fs-small);
  color: var(--color-text);
  transition: background var(--transition);
}

.orow--data:hover {
  background: var(--color-surface);
}

.order-item:last-child .orow--data {
  border-bottom: none;
}

.col-ref {
  font-family: var(--font-display);
  font-size: 15px;
  color: var(--color-text-muted);
}

.col-chev {
  font-size: 18px;
  color: var(--color-text-subtle);
  transition: transform 0.2s ease;
  display: inline-block;
  text-align: center;
}

.col-chev.open {
  transform: rotate(90deg);
}

.status-select {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  font-family: var(--font-body);
  font-size: var(--fs-tiny);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 5px 8px;
  cursor: pointer;
  outline: none;
  width: 100%;
  transition: border-color var(--transition);
}

.status-select:focus { border-color: var(--gold); }

.status-select.s-pending  { color: var(--gold); }
.status-select.s-paid     { color: #48bb78; }
.status-select.s-shipped  { color: #4299e1; }
.status-select.s-delivered{ color: #48bb78; }
.status-select.s-cancelled{ color: #e53e3e; }

.tracking-row {
  display: flex;
  gap: 6px;
}

.tracking-input {
  flex: 1;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: var(--fs-xs);
  padding: 5px 8px;
  outline: none;
  min-width: 0;
  transition: border-color var(--transition);
}

.tracking-input:focus { border-color: var(--gold); }

.tracking-save {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-family: var(--font-body);
  font-size: var(--fs-tiny);
  padding: 5px 8px;
  cursor: pointer;
  transition: all var(--transition);
  white-space: nowrap;
}

.tracking-save:hover:not(:disabled) {
  border-color: var(--gold);
  color: var(--gold);
}

.tracking-save:disabled { opacity: 0.4; cursor: not-allowed; }

.order-details {
  padding: 8px 8px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-bottom: 1px solid var(--color-border);
}

.detail-row {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 16px;
  padding: 8px 12px;
  background: var(--color-surface);
  font-size: var(--fs-small);
  color: var(--color-text-muted);
}

.detail-name { color: var(--color-text); }

.detail-weight {
  font-size: var(--fs-label);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
}

.detail-price {
  font-family: var(--font-display);
  color: var(--color-text);
}

.detail-promo {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--color-surface);
  border-left: 2px solid var(--gold);
  font-size: var(--fs-small);
  color: var(--color-text-muted);
}

.detail-promo__saving { color: var(--gold); }

.order-address {
  padding: 12px 16px;
  background: var(--color-surface);
  border-left: 2px solid var(--gold);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.address-title {
  font-size: var(--fs-tiny);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 4px;
}

.address-line {
  font-size: var(--fs-small);
  color: var(--color-text-muted);
}

/* ── PROMOS ── */

.promo-create-card {
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  padding: 28px 32px;
  margin-bottom: 32px;
  transition: background var(--transition);
}

.create-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 400;
  color: var(--color-text);
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--color-border);
}

.create-form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr auto;
  gap: 12px;
  align-items: end;
}

.create-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.create-label {
  font-size: var(--fs-tiny);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
}

.create-input {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: var(--fs-small);
  padding: 9px 12px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  transition: border-color var(--transition);
}

.create-input:focus { border-color: var(--gold); }

.create-select { cursor: pointer; }

.create-field--btn {
  justify-content: flex-end;
}

.create-btn {
  padding: 9px 20px;
  background: var(--gold);
  border: 1px solid var(--gold);
  color: #0a0a0a;
  font-family: var(--font-body);
  font-size: var(--fs-label);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all var(--transition);
  white-space: nowrap;
}

.create-btn:hover:not(:disabled) { background: transparent; color: var(--gold); }
.create-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.create-error {
  font-size: var(--fs-small);
  color: #e53e3e;
  margin-top: 12px;
}

.create-success {
  font-size: var(--fs-small);
  color: #48bb78;
  margin-top: 12px;
}

.promos-table {
  border: 1px solid var(--color-border);
  overflow-x: auto;
}

.prow {
  display: grid;
  grid-template-columns: 1fr 100px 90px 90px 110px 90px;
  gap: 12px;
  padding: 12px 16px;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  font-size: var(--fs-small);
  color: var(--color-text);
  transition: background var(--transition);
}

.prow:last-child { border-bottom: none; }

.prow--head {
  font-size: var(--fs-tiny);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
  background: var(--color-surface);
}

.prow.inactive {
  opacity: 0.45;
}

.pcol-code {
  font-family: var(--font-display);
  font-size: 16px;
  color: var(--color-text);
  letter-spacing: 0.05em;
}

.pcol-value { color: var(--gold); }

.toggle-btn {
  padding: 5px 10px;
  font-family: var(--font-body);
  font-size: var(--fs-tiny);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all var(--transition);
  border: 1px solid var(--color-border);
  background: none;
  color: var(--color-text-muted);
}

.toggle-btn--on {
  border-color: #48bb78;
  color: #48bb78;
}

.toggle-btn:hover:not(:disabled) { opacity: 0.7; }
.toggle-btn:disabled { cursor: not-allowed; opacity: 0.4; }

@media (max-width: 900px) {
  .create-form {
    grid-template-columns: 1fr 1fr;
  }

  .create-field--btn {
    grid-column: 1 / -1;
  }

  .create-btn {
    width: 100%;
  }
}
</style>
