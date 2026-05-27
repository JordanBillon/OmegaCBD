<template>
  <div class="dashboard-page">

    <div class="page-hero">
      <p class="page-hero__eyebrow">OMEGACBD</p>
      <h1 class="page-hero__title">Mon Compte</h1>
      <div class="page-hero__divider"></div>
      <p class="page-hero__sub">Bienvenue, {{ profile?.first_name || currentEmail }}</p>
    </div>

    <div class="dashboard-section container">

      <div class="dashboard-grid">

        <div class="dashboard-card">
          <div class="dashboard-card__header">
            <h2 class="dashboard-card__title">Mes informations</h2>
            <button v-if="!editMode" class="edit-btn" @click="startEdit">Modifier</button>
          </div>

          <div v-if="!editMode" class="dashboard-info">
            <div v-if="!emailInlineMode" class="info-row">
              <span class="info-label">Email</span>
              <span class="info-value info-value--email">
                {{ currentEmail }}
                <button class="pencil-btn" aria-label="Modifier l'email" @click="startEmailInline">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
              </span>
            </div>
            <div v-else class="email-inline-wrap">
              <p class="email-inline-title">Nouvelle adresse email</p>
              <div class="edit-field">
                <input v-model="emailForm.new_email" class="edit-input" type="email" placeholder="nouvelle@email.com" maxlength="254" autocomplete="email" autofocus />
              </div>
              <div class="edit-field">
                <input v-model="emailForm.email_password" class="edit-input" type="password" placeholder="Confirmez avec votre mot de passe" maxlength="128" autocomplete="current-password" />
              </div>
              <p v-if="emailInlineError" class="edit-error">{{ emailInlineError }}</p>
              <p v-if="emailInlineSuccess" class="edit-success">Lien de confirmation envoyé à votre nouvelle adresse.</p>
              <div class="edit-actions">
                <button class="edit-cancel" :disabled="emailInlineSuccess" @click="cancelEmailInline">Annuler</button>
                <button class="edit-save" :disabled="savingEmail || emailInlineSuccess" @click="saveEmailInline">
                  {{ savingEmail ? 'Envoi…' : 'Envoyer le lien' }}
                </button>
              </div>
            </div>
            <div class="info-row">
              <span class="info-label">Prénom</span>
              <span v-if="inlineField !== 'first_name'" class="info-value info-value--email">
                {{ profile?.first_name || '—' }}
                <button class="pencil-btn" aria-label="Modifier le prénom" @click="startInline('first_name')">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
              </span>
              <div v-else class="inline-field">
                <input v-model="inlineValue" class="inline-input" autofocus @keyup.enter="saveInline" @keyup.escape="cancelInline" />
                <button class="inline-ok" :disabled="savingInline" @click="saveInline">{{ savingInline ? '…' : '✓' }}</button>
                <button class="inline-x" @click="cancelInline">✕</button>
              </div>
            </div>
            <p v-if="inlineField === 'first_name' && inlineError" class="inline-error">{{ inlineError }}</p>

            <div class="info-row">
              <span class="info-label">Nom</span>
              <span v-if="inlineField !== 'last_name'" class="info-value info-value--email">
                {{ profile?.last_name || '—' }}
                <button class="pencil-btn" aria-label="Modifier le nom" @click="startInline('last_name')">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
              </span>
              <div v-else class="inline-field">
                <input v-model="inlineValue" class="inline-input" autofocus @keyup.enter="saveInline" @keyup.escape="cancelInline" />
                <button class="inline-ok" :disabled="savingInline" @click="saveInline">{{ savingInline ? '…' : '✓' }}</button>
                <button class="inline-x" @click="cancelInline">✕</button>
              </div>
            </div>
            <p v-if="inlineField === 'last_name' && inlineError" class="inline-error">{{ inlineError }}</p>

            <div class="info-row">
              <span class="info-label">Téléphone</span>
              <span v-if="inlineField !== 'phone'" class="info-value info-value--email">
                {{ formatPhone(profile?.phone) }}
                <button class="pencil-btn" aria-label="Modifier le téléphone" @click="startInline('phone')">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
              </span>
              <div v-else class="inline-field">
                <input v-model="inlineValue" class="inline-input" type="tel" autofocus @keyup.enter="saveInline" @keyup.escape="cancelInline" />
                <button class="inline-ok" :disabled="savingInline" @click="saveInline">{{ savingInline ? '…' : '✓' }}</button>
                <button class="inline-x" @click="cancelInline">✕</button>
              </div>
            </div>
            <p v-if="inlineField === 'phone' && inlineError" class="inline-error">{{ inlineError }}</p>

            <div class="info-row">
              <span class="info-label">Membre depuis</span>
              <span class="info-value">{{ formatDate(profile?.created_at) }}</span>
            </div>
          </div>

          <div v-else class="edit-form">
            <div class="edit-field">
              <label class="edit-label">Prénom</label>
              <input v-model="editForm.first_name" class="edit-input" type="text" placeholder="Prénom" maxlength="50" />
            </div>
            <div class="edit-field">
              <label class="edit-label">Nom</label>
              <input v-model="editForm.last_name" class="edit-input" type="text" placeholder="Nom" maxlength="50" />
            </div>
            <div class="edit-field">
              <label class="edit-label">Téléphone</label>
              <input v-model="editForm.phone" class="edit-input" type="tel" placeholder="06 12 34 56 78" maxlength="20" />
            </div>
            <p v-if="editError" class="edit-error">{{ editError }}</p>
            <p v-if="editSuccess" class="edit-success">Profil mis à jour.</p>
            <div class="edit-actions">
              <button class="edit-cancel" :disabled="editSuccess" @click="cancelEdit">Annuler</button>
              <button class="edit-save" :disabled="savingProfile" @click="saveProfile">
                {{ savingProfile ? 'Enregistrement…' : 'Enregistrer' }}
              </button>
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
                <span class="order-status" :class="order.status">{{ statusLabel(order.status) }}</span>
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
                <div v-if="order.promo_code && Number(order.discount) > 0" class="order-promo">
                  <span class="order-promo__code">Code {{ order.promo_code }}</span>
                  <span class="order-promo__saving">− {{ Number(order.discount).toFixed(2).replace('.', ',') }} €</span>
                </div>
                <div v-if="order.shipping_address" class="order-shipping">
                  <p class="shipping-title">Livraison</p>
                  <div class="shipping-row">
                    <span class="shipping-key">Destinataire</span>
                    <span class="shipping-val">{{ order.shipping_address.first_name }} {{ order.shipping_address.last_name }}</span>
                  </div>
                  <div class="shipping-row">
                    <span class="shipping-key">Adresse</span>
                    <span class="shipping-val">{{ order.shipping_address.line1 }}<template v-if="order.shipping_address.line2">, {{ order.shipping_address.line2 }}</template></span>
                  </div>
                  <div class="shipping-row">
                    <span class="shipping-key">Ville</span>
                    <span class="shipping-val">{{ order.shipping_address.postal_code }} {{ order.shipping_address.city }}</span>
                  </div>
                  <div class="shipping-row">
                    <span class="shipping-key">Téléphone</span>
                    <span class="shipping-val">{{ order.shipping_address.phone }}</span>
                  </div>
                  <div v-if="order.tracking_number" class="shipping-row shipping-row--tracking">
                    <span class="shipping-key">N° de suivi</span>
                    <span class="shipping-val tracking-number">{{ order.tracking_number }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="dashboard-card security-card">
        <div class="dashboard-card__header">
          <h2 class="dashboard-card__title">Mot de passe</h2>
          <button v-if="!pwdMode" class="edit-btn" @click="pwdMode = true">Modifier</button>
        </div>

        <p v-if="!pwdMode" class="pwd-placeholder">••••••••••••</p>

        <div v-else class="edit-form">
          <div class="edit-field">
            <label class="edit-label">Mot de passe actuel</label>
            <input v-model="pwdForm.current" class="edit-input" type="password" placeholder="Mot de passe actuel" maxlength="128" autocomplete="current-password" />
          </div>
          <div class="edit-field">
            <label class="edit-label">Nouveau mot de passe</label>
            <input v-model="pwdForm.next" class="edit-input" type="password" placeholder="8 caractères minimum" maxlength="128" autocomplete="new-password" />
          </div>
          <div class="edit-field">
            <label class="edit-label">Confirmer le nouveau mot de passe</label>
            <input v-model="pwdForm.confirm" class="edit-input" type="password" placeholder="Répétez le nouveau mot de passe" maxlength="128" autocomplete="new-password" />
          </div>
          <p v-if="pwdError" class="edit-error">{{ pwdError }}</p>
          <p v-if="pwdSuccess" class="edit-success">Mot de passe mis à jour.</p>
          <div class="edit-actions">
            <button class="edit-cancel" :disabled="pwdSuccess" @click="cancelPwd">Annuler</button>
            <button class="edit-save" :disabled="savingPwd" @click="savePassword">
              {{ savingPwd ? 'Vérification…' : 'Enregistrer' }}
            </button>
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
const currentEmail = ref('')
const router = useRouter()

const profile = ref(null)
const orders = ref([])
const expandedOrder = ref(null)
const loadingOrders = ref(true)

const editMode = ref(false)
const savingProfile = ref(false)
const editError = ref('')
const editSuccess = ref(false)
const editForm = reactive({ first_name: '', last_name: '', phone: '' })

const inlineField = ref(null)
const inlineValue = ref('')
const savingInline = ref(false)
const inlineError = ref('')

const startInline = (field) => {
  const values = {
    first_name: profile.value?.first_name || '',
    last_name: profile.value?.last_name || '',
    phone: formatPhone(profile.value?.phone) || '',
  }
  inlineField.value = field
  inlineValue.value = values[field]
  inlineError.value = ''
  emailInlineMode.value = false
}

const cancelInline = () => {
  inlineField.value = null
  inlineValue.value = ''
  inlineError.value = ''
}

const saveInline = async () => {
  inlineError.value = ''
  const field = inlineField.value
  const val = inlineValue.value.trim()

  if (field !== 'phone' && !val) {
    inlineError.value = 'Ce champ ne peut pas être vide.'
    return
  }
  if (field === 'phone' && val && !/^(0|\+33)[1-9]\d{8}$/.test(val.replace(/[\s.\-]/g, ''))) {
    inlineError.value = 'Numéro invalide (ex : 06 12 34 56 78).'
    return
  }

  savingInline.value = true
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  const updateData = field === 'phone'
    ? { phone: val.replace(/[\s.\-]/g, '') || null }
    : { [field]: val }

  const { error } = await supabase.from('profiles').update(updateData).eq('id', currentUser.id)
  savingInline.value = false

  if (error) { inlineError.value = 'Erreur. Réessayez.'; return }

  profile.value = { ...profile.value, ...updateData }
  cancelInline()
}

const startEdit = () => {
  editForm.first_name = profile.value?.first_name || ''
  editForm.last_name = profile.value?.last_name || ''
  editForm.phone = profile.value?.phone || ''
  editError.value = ''
  editSuccess.value = false
  emailInlineMode.value = false
  cancelInline()
  editMode.value = true
}

const cancelEdit = () => {
  editMode.value = false
  editError.value = ''
  editSuccess.value = false
}

const saveProfile = async () => {
  editError.value = ''
  editSuccess.value = false

  if (!editForm.first_name.trim() || !editForm.last_name.trim()) {
    editError.value = 'Le prénom et le nom sont obligatoires.'
    return
  }
  if (editForm.phone && !/^(0|\+33)[1-9]\d{8}$/.test(editForm.phone.replace(/[\s.\-]/g, ''))) {
    editError.value = 'Numéro de téléphone invalide (ex : 06 12 34 56 78).'
    return
  }

  savingProfile.value = true
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  const { error } = await supabase.from('profiles').update({
    first_name: editForm.first_name.trim(),
    last_name: editForm.last_name.trim(),
    phone: editForm.phone.replace(/[\s.\-]/g, '') || null,
  }).eq('id', currentUser.id)
  savingProfile.value = false

  if (error) {
    editError.value = 'Une erreur est survenue. Réessayez.'
    return
  }

  const cleanedPhone = editForm.phone.replace(/[\s.\-]/g, '') || null
  profile.value = { ...profile.value, first_name: editForm.first_name.trim(), last_name: editForm.last_name.trim(), phone: cleanedPhone }
  editSuccess.value = true
  setTimeout(() => { editMode.value = false; editSuccess.value = false }, 1200)
}

const emailInlineMode = ref(false)
const savingEmail = ref(false)
const emailInlineError = ref('')
const emailInlineSuccess = ref(false)
const emailForm = reactive({ new_email: '', email_password: '' })

const startEmailInline = () => {
  emailForm.new_email = ''
  emailForm.email_password = ''
  emailInlineError.value = ''
  emailInlineSuccess.value = false
  emailInlineMode.value = true
}

const cancelEmailInline = () => {
  emailInlineMode.value = false
  emailInlineError.value = ''
  emailInlineSuccess.value = false
}

const saveEmailInline = async () => {
  emailInlineError.value = ''
  emailInlineSuccess.value = false

  const newEmail = emailForm.new_email.trim().toLowerCase()
  if (!newEmail || !emailForm.email_password) {
    emailInlineError.value = 'Tous les champs sont obligatoires.'
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
    emailInlineError.value = 'Adresse email invalide.'
    return
  }
  if (newEmail === currentEmail.value) {
    emailInlineError.value = 'Cette adresse est déjà la vôtre.'
    return
  }

  savingEmail.value = true
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: currentEmail.value,
    password: emailForm.email_password,
  })
  if (signInError) {
    savingEmail.value = false
    emailInlineError.value = 'Mot de passe incorrect.'
    return
  }

  const redirectTo = `${window.location.origin}/compte/confirm#email-change`
  const { error: updateError } = await supabase.auth.updateUser({ email: newEmail }, { emailRedirectTo: redirectTo })
  savingEmail.value = false

  if (updateError) {
    emailInlineError.value = 'Une erreur est survenue. Réessayez.'
    return
  }

  emailInlineSuccess.value = true
  emailForm.email_password = ''
  setTimeout(() => cancelEmailInline(), 3000)
}

const pwdMode = ref(false)
const savingPwd = ref(false)
const pwdError = ref('')
const pwdSuccess = ref(false)
const pwdForm = reactive({ current: '', next: '', confirm: '' })

const cancelPwd = () => {
  pwdMode.value = false
  pwdError.value = ''
  pwdSuccess.value = false
  pwdForm.current = ''
  pwdForm.next = ''
  pwdForm.confirm = ''
}

const savePassword = async () => {
  pwdError.value = ''
  pwdSuccess.value = false

  if (!pwdForm.current || !pwdForm.next || !pwdForm.confirm) {
    pwdError.value = 'Tous les champs sont obligatoires.'
    return
  }
  if (pwdForm.next.length < 8) {
    pwdError.value = 'Le nouveau mot de passe doit contenir au moins 8 caractères.'
    return
  }
  if (pwdForm.next !== pwdForm.confirm) {
    pwdError.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  savingPwd.value = true
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: currentEmail.value,
    password: pwdForm.current,
  })
  if (signInError) {
    savingPwd.value = false
    pwdError.value = 'Mot de passe actuel incorrect.'
    return
  }

  const { error: updateError } = await supabase.auth.updateUser({ password: pwdForm.next })
  savingPwd.value = false

  if (updateError) {
    pwdError.value = 'Une erreur est survenue. Réessayez.'
    return
  }

  pwdSuccess.value = true
  setTimeout(() => cancelPwd(), 1200)
}

const STATUS_LABELS = { pending: 'En attente', paid: 'Payé', shipped: 'Expédié', delivered: 'Livré', cancelled: 'Annulé' }
const statusLabel = (s) => STATUS_LABELS[s] ?? s

const toggleOrder = (id) => {
  expandedOrder.value = expandedOrder.value === id ? null : id
}

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

const formatPhone = (phone) => {
  if (!phone) return '—'
  const cleaned = phone.replace(/[\s.\-]/g, '')
  if (/^\+33[1-9]\d{8}$/.test(cleaned)) {
    return cleaned.replace(/^\+33/, '0').replace(/(\d{2})(?=\d)/g, '$1 ').trim()
  }
  if (/^0[1-9]\d{8}$/.test(cleaned)) {
    return cleaned.replace(/(\d{2})(?=\d)/g, '$1 ').trim()
  }
  return phone
}

const logout = async () => {
  await supabase.auth.signOut()
  router.push('/')
}

onMounted(async () => {
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  if (!currentUser) { router.push('/compte/connexion'); return }

  currentEmail.value = currentUser.email

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

.dashboard-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.dashboard-card__title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 400;
  color: var(--color-text);
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.edit-btn {
  font-size: var(--fs-tiny);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--gold);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: opacity var(--transition);
}

.edit-btn:hover { opacity: 0.7; }

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.edit-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.edit-label {
  font-size: var(--fs-tiny);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
}

.edit-input {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: var(--fs-body);
  padding: 10px 14px;
  outline: none;
  transition: border-color var(--transition);
  width: 100%;
  box-sizing: border-box;
}

.edit-input:focus { border-color: var(--gold); }

.info-value--email {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pencil-btn {
  background: none;
  border: none;
  padding: 2px;
  cursor: pointer;
  color: var(--color-text-subtle);
  display: flex;
  align-items: center;
  transition: color var(--transition);
  flex-shrink: 0;
}

.pencil-btn:hover { color: var(--gold); }

.inline-field {
  display: flex;
  align-items: center;
  gap: 6px;
}

.inline-input {
  background: var(--color-surface);
  border: 1px solid var(--gold);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: var(--fs-small);
  padding: 5px 10px;
  outline: none;
  width: 150px;
  transition: border-color var(--transition);
}

.inline-ok {
  background: var(--gold);
  border: 1px solid var(--gold);
  color: #0a0a0a;
  font-size: 12px;
  padding: 5px 9px;
  cursor: pointer;
  transition: all var(--transition);
  line-height: 1;
}

.inline-ok:hover:not(:disabled) { background: transparent; color: var(--gold); }
.inline-ok:disabled { opacity: 0.5; cursor: not-allowed; }

.inline-x {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 12px;
  padding: 5px 9px;
  cursor: pointer;
  transition: all var(--transition);
  line-height: 1;
}

.inline-x:hover { border-color: #e53e3e; color: #e53e3e; }

.inline-error {
  font-size: var(--fs-tiny);
  color: #e53e3e;
  padding-bottom: 6px;
  margin-top: -6px;
  text-align: right;
}

.email-inline-wrap {
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-bottom: 1px solid var(--color-border);
}

.email-inline-title {
  font-size: var(--fs-tiny);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--gold);
  margin: 0;
}

.edit-error {
  font-size: var(--fs-small);
  color: #e53e3e;
  margin: 0;
}

.edit-success {
  font-size: var(--fs-small);
  color: #48bb78;
  margin: 0;
}

.edit-actions {
  display: flex;
  gap: 12px;
  margin-top: 4px;
}

.edit-cancel {
  flex: 1;
  padding: 10px;
  border: 1px solid var(--color-border);
  background: none;
  color: var(--color-text-muted);
  font-family: var(--font-body);
  font-size: var(--fs-label);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all var(--transition);
}

.edit-cancel:hover:not(:disabled) { border-color: var(--color-text-muted); color: var(--color-text); }
.edit-cancel:disabled { opacity: 0.4; cursor: not-allowed; }

.edit-save {
  flex: 2;
  padding: 10px;
  border: 1px solid var(--gold);
  background: var(--gold);
  color: #0a0a0a;
  font-family: var(--font-body);
  font-size: var(--fs-label);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all var(--transition);
}

.edit-save:hover:not(:disabled) { background: transparent; color: var(--gold); }
.edit-save:disabled { opacity: 0.5; cursor: not-allowed; }

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

.order-shipping {
  padding: 12px 16px;
  background: var(--color-surface);
  border-left: 2px solid var(--gold);
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.shipping-title {
  font-size: var(--fs-tiny);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 4px;
}

.shipping-row {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 12px;
  font-size: var(--fs-small);
}

.shipping-key {
  color: var(--color-text-subtle);
  text-transform: uppercase;
  font-size: var(--fs-tiny);
  letter-spacing: 0.1em;
  padding-top: 1px;
}

.shipping-val {
  color: var(--color-text);
}

.shipping-row--tracking {
  margin-top: 6px;
  padding-top: 10px;
  border-top: 1px solid var(--color-border);
}

.tracking-number {
  font-family: monospace;
  font-size: var(--fs-body);
  color: var(--gold);
  letter-spacing: 0.08em;
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

.order-promo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--color-surface);
  border-left: 2px solid var(--gold);
  font-size: var(--fs-small);
}

.order-promo__code {
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
}

.order-promo__saving {
  color: var(--gold);
  font-family: var(--font-display);
  font-size: 15px;
}

.security-card {
  margin-bottom: 48px;
  max-width: 420px;
}

.pwd-placeholder {
  font-size: var(--fs-body);
  color: var(--color-text-subtle);
  letter-spacing: 0.2em;
  margin: 0;
}

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
