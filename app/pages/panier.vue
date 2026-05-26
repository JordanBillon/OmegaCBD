<template>
  <div class="panier-page">

    <div class="page-hero">
      <p class="page-hero__eyebrow">OMEGACBD</p>
      <h1 class="page-hero__title">Mon Panier</h1>
      <div class="page-hero__divider"></div>
      <p class="page-hero__sub">{{ count > 0 ? `${count} article${count > 1 ? 's' : ''}` : 'Votre panier est vide' }}</p>
    </div>

    <div class="panier-section container">

      <div v-if="items.length === 0" class="panier-empty">
        <p>Vous n'avez pas encore ajouté de produits.</p>
        <div class="panier-empty__links">
          <NuxtLink to="/produits/cbd" class="btn btn--ghost">Collection CBD</NuxtLink>
          <NuxtLink to="/produits/thx" class="btn btn--ghost">Collection THX</NuxtLink>
        </div>
      </div>

      <div v-else class="panier-content">
        <div class="panier-items">
          <div v-for="item in items" :key="`${item.productId}-${item.weight}`" class="panier-item">
            <img :src="item.image" :alt="item.name" class="panier-item__img" />
            <div class="panier-item__info">
              <p class="panier-item__name">{{ item.name }}</p>
              <p class="panier-item__weight">{{ item.weight }}</p>
            </div>
            <div class="panier-item__qty">
              <button class="qty-btn" @click="item.quantity === 1 ? askRemoveItem(item) : updateQuantity(item.productId, item.weight, item.quantity - 1)">−</button>
              <span class="qty-value">{{ item.quantity }}</span>
              <button class="qty-btn" @click="updateQuantity(item.productId, item.weight, item.quantity + 1)">+</button>
            </div>
            <p class="panier-item__price">{{ (item.price * item.quantity).toFixed(2).replace('.', ',') }} €</p>
            <button class="panier-item__remove" @click="remove(item.productId, item.weight)">✕</button>
          </div>
        </div>

        <div class="panier-summary">
          <div class="summary-card">
            <h2 class="summary-title">Récapitulatif</h2>
            <div class="summary-row">
              <span>Sous-total</span>
              <span>{{ total.toFixed(2).replace('.', ',') }} €</span>
            </div>
            <div class="summary-row">
              <span>Livraison</span>
              <span class="summary-free">Offerte</span>
            </div>

            <!-- Code promo -->
            <div v-if="!appliedPromo" class="promo-section">
              <div class="promo-input-row">
                <input
                  v-model="promoInput"
                  class="form-input promo-input"
                  type="text"
                  placeholder="Code promo"
                  :disabled="promoLoading"
                  @keyup.enter="applyPromo"
                />
                <button class="promo-btn" :disabled="promoLoading || !promoInput.trim()" @click="applyPromo">
                  {{ promoLoading ? '…' : 'Appliquer' }}
                </button>
              </div>
              <p v-if="promoError" class="promo-error">{{ promoError }}</p>
            </div>
            <div v-else class="summary-row summary-row--promo">
              <span>
                {{ appliedPromo.code }}
                <button class="promo-remove" aria-label="Retirer le code promo" @click="removePromo">✕</button>
              </span>
              <span class="promo-discount">− {{ discountAmount.toFixed(2).replace('.', ',') }} €</span>
            </div>

            <div class="summary-row summary-row--total">
              <span>Total</span>
              <span>{{ finalTotal.toFixed(2).replace('.', ',') }} €</span>
            </div>
            <button class="btn btn--primary btn--full" :disabled="loading" @click="commander">
              {{ loading ? 'Commande en cours…' : 'Commander' }}
            </button>
            <p v-if="orderError" class="order-error">{{ orderError }}</p>
            <button class="panier-clear" @click="confirmClear">Vider le panier</button>
          </div>
        </div>
      </div>

    </div>

  </div>

  <Transition name="modal">
    <div v-if="modal.show" class="modal-overlay" @click.self="modal.show = false">
      <div class="modal-card">
        <p class="modal-title">{{ modal.title }}</p>
        <p class="modal-sub">{{ modal.sub }}</p>
        <div class="modal-actions">
          <button class="modal-btn modal-btn--cancel" @click="modal.show = false">Annuler</button>
          <button class="modal-btn modal-btn--confirm" @click="modal.confirm">{{ modal.confirmLabel }}</button>
        </div>
      </div>
    </div>
  </Transition>

  <Transition name="modal">
    <div v-if="showAddressForm" class="modal-overlay">
      <div class="modal-card modal-card--large">
        <button class="modal-close" @click="closeAddressForm" aria-label="Fermer">✕</button>
        <p class="modal-title">Adresse de livraison</p>
        <p class="modal-sub">France métropolitaine uniquement</p>
        <div class="address-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Prénom *</label>
              <input v-model="address.first_name" class="form-input" type="text" autocomplete="given-name" />
            </div>
            <div class="form-group">
              <label class="form-label">Nom *</label>
              <input v-model="address.last_name" class="form-input" type="text" autocomplete="family-name" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Adresse *</label>
            <input v-model="address.line1" class="form-input" type="text" autocomplete="address-line1" />
          </div>
          <div class="form-group">
            <label class="form-label">Complément <span class="form-optional">(optionnel)</span></label>
            <input v-model="address.line2" class="form-input" type="text" autocomplete="address-line2" />
          </div>
          <div class="form-row">
            <div class="form-group form-group--sm">
              <label class="form-label">Code postal *</label>
              <input v-model="address.postal_code" class="form-input" type="text" maxlength="5" autocomplete="postal-code" />
            </div>
            <div class="form-group">
              <label class="form-label">Ville *</label>
              <input v-model="address.city" class="form-input" type="text" autocomplete="address-level2" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Téléphone *</label>
            <input v-model="address.phone" class="form-input" type="tel" autocomplete="tel" />
          </div>
          <label class="form-check">
            <input type="checkbox" v-model="saveAddress" class="check-input" />
            <span class="check-label">
              {{ hasSavedAddress ? 'Mettre à jour mon adresse enregistrée' : 'Mémoriser cette adresse pour mes prochaines commandes' }}
            </span>
          </label>
          <p v-if="addressError" class="order-error">{{ addressError }}</p>
        </div>
        <div class="modal-actions modal-actions--top">
          <button class="modal-btn modal-btn--cancel" @click="closeAddressForm">Annuler</button>
          <button class="modal-btn modal-btn--confirm" :disabled="loading" @click="confirmOrder">
            {{ loading ? 'En cours…' : 'Confirmer la commande' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>

</template>

<script setup>
const { items, remove, updateQuantity, clear, total, count, load } = useCart()
onMounted(load)

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const loading = ref(false)
const orderError = ref('')

// Code promo
const promoInput = ref('')
const appliedPromo = ref(null)
const promoError = ref('')
const promoLoading = ref(false)

const discountAmount = computed(() => {
  if (!appliedPromo.value) return 0
  if (appliedPromo.value.discount_type === 'percent') {
    return Math.round(total.value * appliedPromo.value.discount_value) / 100
  }
  return Math.min(appliedPromo.value.discount_value, total.value)
})

const finalTotal = computed(() => Math.max(0, total.value - discountAmount.value))

const applyPromo = async () => {
  const code = promoInput.value.trim()
  if (!code) return
  promoError.value = ''
  promoLoading.value = true
  try {
    const data = await $fetch('/api/promo/validate', { method: 'POST', body: { code } })
    appliedPromo.value = data
    promoInput.value = ''
  } catch (e) {
    promoError.value = e.data?.message || 'Code promo invalide.'
  } finally {
    promoLoading.value = false
  }
}

const removePromo = () => {
  appliedPromo.value = null
  promoError.value = ''
  promoInput.value = ''
}

const showAddressForm = ref(false)
const addressError = ref('')
const saveAddress = ref(true)
const hasSavedAddress = ref(false)
const currentSession = ref(null)
const address = reactive({
  first_name: '', last_name: '', line1: '', line2: '', postal_code: '', city: '', phone: ''
})

const closeAddressForm = () => {
  showAddressForm.value = false
  currentSession.value = null
}

const commander = async () => {
  if (!user.value) return navigateTo('/compte/connexion')
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return navigateTo('/compte/connexion')
  currentSession.value = session
  addressError.value = ''
  orderError.value = ''

  const { data: profile } = await supabase
    .from('profiles')
    .select('shipping_address')
    .eq('id', session.user.id)
    .single()

  if (profile?.shipping_address) {
    Object.assign(address, profile.shipping_address)
    hasSavedAddress.value = true
    saveAddress.value = true
  } else {
    hasSavedAddress.value = false
    saveAddress.value = true
  }

  showAddressForm.value = true
}

const confirmOrder = async () => {
  addressError.value = ''
  if (!address.first_name || !address.last_name || !address.line1 || !address.postal_code || !address.city || !address.phone) {
    addressError.value = 'Veuillez remplir tous les champs obligatoires.'
    return
  }
  if (!/^\d{5}$/.test(address.postal_code)) {
    addressError.value = 'Le code postal doit contenir exactement 5 chiffres.'
    return
  }
  if (!/^(0|\+33)[1-9]\d{8}$/.test(address.phone.replace(/[\s.\-]/g, ''))) {
    addressError.value = 'Numéro de téléphone invalide (ex : 06 12 34 56 78).'
    return
  }
  loading.value = true
  const session = currentSession.value
  if (!session) {
    loading.value = false
    return navigateTo('/compte/connexion')
  }

  const { error } = await supabase.from('orders').insert({
    user_id: session.user.id,
    items: items.value,
    total: finalTotal.value,
    promo_code: appliedPromo.value?.code || null,
    discount: discountAmount.value || 0,
    shipping_address: { ...address }
  })

  if (saveAddress.value) {
    const { error: saveError } = await supabase
      .from('profiles')
      .update({ shipping_address: { ...address } })
      .eq('id', session.user.id)
    if (saveError) console.error('Échec sauvegarde adresse:', saveError)
  }

  loading.value = false
  if (error) {
    orderError.value = 'Une erreur est survenue. Veuillez réessayer.'
    showAddressForm.value = false
    return
  }

  const orderSnapshot = {
    items: items.value.map(i => ({ ...i })),
    total: finalTotal.value,
    promo_code: appliedPromo.value?.code || null,
    discount: discountAmount.value || 0
  }
  clear()
  appliedPromo.value = null
  showAddressForm.value = false

  $fetch('/api/order-confirm', {
    method: 'POST',
    body: {
      items: orderSnapshot.items,
      total: orderSnapshot.total,
      promo_code: orderSnapshot.promo_code,
      discount: orderSnapshot.discount,
      shipping_address: { ...address },
      first_name: address.first_name
    }
  }).catch(e => console.error('Échec mail confirmation:', e))

  navigateTo('/compte/dashboard')
}

const modal = reactive({ show: false, title: '', sub: '', confirmLabel: '', confirm: () => {} })

const openModal = (title, sub, confirmLabel, onConfirm) => {
  modal.title = title
  modal.sub = sub
  modal.confirmLabel = confirmLabel
  modal.confirm = () => { onConfirm(); modal.show = false }
  modal.show = true
}

const confirmClear = () => openModal(
  'Vider le panier ?',
  'Tous vos articles seront supprimés.',
  'Vider',
  clear
)

const askRemoveItem = (item) => openModal(
  'Retirer cet article ?',
  `${item.name} — ${item.weight} sera supprimé du panier.`,
  'Retirer',
  () => remove(item.productId, item.weight)
)
</script>

<style scoped>
.panier-page {
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

.panier-section {
  padding: 60px 24px 60px;
}

.panier-empty {
  text-align: center;
  padding: 60px 0;
}

.panier-empty p {
  font-size: 16px;
  color: var(--color-text-muted);
  margin-bottom: 32px;
}

.panier-empty__links {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.panier-content {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 40px;
  align-items: start;
  margin-bottom: 48px;
}

.panier-item {
  display: grid;
  grid-template-columns: 80px 1fr auto auto auto;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid var(--color-border);
}

.panier-item__img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  background: var(--color-surface);
  padding: 8px;
}

.panier-item__name {
  font-family: var(--font-display);
  font-size: 18px;
  color: var(--color-text);
  margin-bottom: 4px;
}

.panier-item__weight {
  font-size: var(--fs-xs);
  letter-spacing: 0.1em;
  color: var(--color-text-subtle);
  text-transform: uppercase;
}

.panier-item__qty {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--color-border);
  padding: 6px 12px;
}

.qty-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: var(--color-text);
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}

.qty-value {
  font-size: var(--fs-body);
  color: var(--color-text);
  min-width: 20px;
  text-align: center;
}

.panier-item__price {
  font-family: var(--font-display);
  font-size: 18px;
  color: var(--color-text);
  white-space: nowrap;
}

.panier-item__remove {
  background: none;
  border: none;
  font-size: var(--fs-body);
  color: var(--color-text-subtle);
  cursor: pointer;
  transition: color var(--transition);
}

.panier-item__remove:hover {
  color: #e53e3e;
}

.summary-card {
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  padding: 28px;
  transition: background var(--transition);
  position: sticky;
  top: calc(var(--navbar-height) + 20px);
}

.summary-title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 400;
  color: var(--color-text);
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: var(--fs-body);
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
}

.summary-free {
  color: var(--gold);
}

.summary-row--total {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 24px;
}

.btn {
  display: inline-block;
  padding: 14px 32px;
  font-size: var(--fs-label);
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  transition: all var(--transition);
  text-align: center;
  cursor: pointer;
  border: none;
  font-family: var(--font-body);
}

.btn--primary {
  background: var(--color-text);
  color: var(--color-bg);
}

.btn--primary:hover {
  background: var(--gold);
  color: var(--white);
}

.btn--ghost {
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  background: none;
}

.btn--ghost:hover {
  border-color: var(--gold);
  color: var(--gold);
}

.btn--full {
  display: block;
  width: 100%;
  margin-bottom: 12px;
}

.order-error {
  font-size: var(--fs-xs);
  color: #e53e3e;
  text-align: center;
  margin-top: 8px;
}

.panier-clear {
  display: block;
  width: 100%;
  background: none;
  border: none;
  font-size: var(--fs-label);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
  cursor: pointer;
  text-align: center;
  padding: 8px;
  transition: color var(--transition);
}

.panier-clear:hover {
  color: #e53e3e;
}


.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  backdrop-filter: blur(4px);
}

.modal-card {
  position: relative;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  padding: 40px 48px;
  text-align: center;
  max-width: 380px;
  width: 90%;
}

.modal-title {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 400;
  color: var(--color-text);
  margin-bottom: 10px;
}

.modal-sub {
  font-size: var(--fs-small);
  color: var(--color-text-muted);
  margin-bottom: 32px;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-btn {
  flex: 1;
  padding: 12px;
  font-family: var(--font-body);
  font-size: var(--fs-label);
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all var(--transition);
}

.modal-btn--cancel {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
}

.modal-btn--cancel:hover {
  border-color: var(--color-text);
  color: var(--color-text);
}

.modal-btn--confirm {
  background: var(--color-text);
  border: 1px solid var(--color-text);
  color: var(--color-bg);
}

.modal-btn--confirm:hover {
  background: #e53e3e;
  border-color: #e53e3e;
  color: #fff;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 20px;
  background: none;
  border: none;
  font-size: 16px;
  color: var(--color-text-subtle);
  cursor: pointer;
  transition: color var(--transition);
  line-height: 1;
  padding: 4px;
}

.modal-close:hover {
  color: var(--color-text);
}

.modal-card--large {
  max-width: 520px;
  text-align: left;
}

.address-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 24px 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group--sm {
  max-width: 130px;
}

.form-label {
  font-size: var(--fs-tiny);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
}

.form-optional {
  text-transform: none;
  letter-spacing: 0;
  font-size: 11px;
  color: var(--color-text-subtle);
}

.form-input {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 10px 14px;
  font-family: var(--font-body);
  font-size: var(--fs-body);
  outline: none;
  transition: border-color var(--transition);
  width: 100%;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: var(--gold);
}

.form-check {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.check-input {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  accent-color: var(--gold);
  cursor: pointer;
}

.check-label {
  font-size: var(--fs-small);
  color: var(--color-text-muted);
  cursor: pointer;
}

.modal-actions--top {
  margin-top: 8px;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-card,
.modal-leave-to .modal-card {
  transform: scale(0.95);
  opacity: 0;
}

.promo-section {
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
}

.promo-input-row {
  display: flex;
  gap: 8px;
}

.promo-input {
  flex: 1;
  padding: 8px 12px;
  font-size: var(--fs-small);
}

.promo-btn {
  padding: 8px 14px;
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: var(--fs-label);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all var(--transition);
  font-family: var(--font-body);
  white-space: nowrap;
}

.promo-btn:hover:not(:disabled) {
  border-color: var(--gold);
  color: var(--gold);
}

.promo-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.promo-error {
  font-size: var(--fs-xs);
  color: #e53e3e;
  margin-top: 6px;
}

.summary-row--promo {
  color: var(--color-text-muted);
}

.promo-discount {
  color: var(--gold);
}

.promo-remove {
  background: none;
  border: none;
  font-size: 11px;
  color: var(--color-text-subtle);
  cursor: pointer;
  padding: 0 2px;
  margin-left: 4px;
  vertical-align: middle;
  transition: color var(--transition);
}

.promo-remove:hover {
  color: #e53e3e;
}

@media (max-width: 850px) {
  .panier-content {
    grid-template-columns: 1fr;
  }

  .panier-item {
    grid-template-columns: 80px 1fr auto;
    grid-template-areas:
      "img info remove"
      "img qty  price";
    gap: 10px 16px;
  }

  .panier-item__img    { grid-area: img; align-self: center; width: 80px; height: 80px; }
  .panier-item__info   { grid-area: info; align-self: end; }
  .panier-item__remove { grid-area: remove; align-self: start; }
  .panier-item__qty    { grid-area: qty; width: fit-content; align-self: center; }
  .panier-item__price  { grid-area: price; align-self: center; text-align: right; }
}
</style>
