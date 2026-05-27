<template>
  <div class="admin-page">

    <div class="page-hero">
      <p class="page-hero__eyebrow">OMEGACBD</p>
      <h1 class="page-hero__title">Administration</h1>
      <div class="page-hero__divider"></div>
      <p class="page-hero__sub">{{ activeOrders.length }} commande{{ activeOrders.length !== 1 ? 's' : '' }}<span v-if="pendingCount > 0" class="hero-pending"> · {{ pendingCount }} en attente</span> · {{ historicalOrders.length }} livré{{ historicalOrders.length !== 1 ? 'es' : 'e' }} · {{ promos.length }} code{{ promos.length !== 1 ? 's' : '' }} promo</p>
    </div>

    <div class="admin-tabs-bar">
      <div class="container">
        <button class="admin-tab" :class="{ active: tab === 'orders' }" @click="tab = 'orders'">
          Commandes <span class="tab-count">{{ activeOrders.length }}</span>
        </button>
        <button class="admin-tab" :class="{ active: tab === 'history' }" @click="tab = 'history'">
          Historique <span class="tab-count">{{ historicalOrders.length }}</span>
        </button>
        <button class="admin-tab" :class="{ active: tab === 'promos' }" @click="tab = 'promos'">
          Codes promo <span class="tab-count">{{ promos.length }}</span>
        </button>
        <button class="admin-tab" :class="{ active: tab === 'blog' }" @click="tab = 'blog'">
          Blog <span class="tab-count">{{ blogPosts.length }}</span>
        </button>
      </div>
    </div>

    <!-- COMMANDES -->
    <div v-if="tab === 'orders'" class="admin-section container">
      <div v-if="loadingOrders" class="admin-loading">Chargement…</div>
      <div v-else-if="activeOrders.length === 0" class="admin-empty">Aucune commande active pour le moment.</div>
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
          <div v-for="order in activeOrders" :key="order.id" class="order-item">
            <div class="orow orow--data" @click="toggleOrder(order.id)">
              <span class="col-ref">#{{ order.id.slice(0, 8) }}</span>
              <span class="col-client">{{ order.shipping_address?.first_name }} {{ order.shipping_address?.last_name }}</span>
              <span class="col-status" @click.stop>
                <select
                  v-model="orderStatuses[order.id]"
                  class="status-select"
                  :class="`s-${orderStatuses[order.id]}`"
                  @change="updateStatus(order)"
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

    <!-- HISTORIQUE -->
    <div v-if="tab === 'history'" class="admin-section container">
      <div v-if="loadingOrders" class="admin-loading">Chargement…</div>
      <div v-else-if="historicalOrders.length === 0" class="admin-empty">Aucune commande livrée pour le moment.</div>
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
          <div v-for="order in historicalOrders" :key="order.id" class="order-item">
            <div class="orow orow--data" @click="toggleOrder(order.id)">
              <span class="col-ref">#{{ order.id.slice(0, 8) }}</span>
              <span class="col-client">{{ order.shipping_address?.first_name }} {{ order.shipping_address?.last_name }}</span>
              <span class="col-status" @click.stop>
                <select
                  v-model="orderStatuses[order.id]"
                  class="status-select"
                  :class="`s-${orderStatuses[order.id]}`"
                  @change="updateStatus(order)"
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
          <span></span>
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
          <span class="pcol-delete">
            <button
              class="delete-btn"
              :disabled="deletingPromo[promo.id]"
              @click="deletePromo(promo)"
              aria-label="Supprimer ce code"
            >
              {{ deletingPromo[promo.id] ? '…' : '✕' }}
            </button>
          </span>
        </div>
      </div>
      <div v-else-if="!loadingPromos" class="admin-empty">Aucun code promo.</div>

    </div>

    <!-- BLOG -->
    <div v-if="tab === 'blog'" class="admin-section container">

      <div class="blog-admin-form">
        <h2 class="blog-form-title">{{ editingPost ? 'Modifier l\'article' : 'Nouvel article' }}</h2>
        <div class="blog-form-grid">
          <div class="create-field" style="grid-column: 1/-1">
            <label class="create-label">Titre *</label>
            <input v-model="blogForm.title" class="create-input" type="text" placeholder="Titre de l'article" @input="onTitleInput" />
          </div>
          <div class="create-field">
            <label class="create-label">Slug (URL) *</label>
            <input v-model="blogForm.slug" class="create-input" type="text" placeholder="mon-article" />
          </div>
          <div class="create-field">
            <label class="create-label">Catégorie</label>
            <input v-model="blogForm.category" class="create-input" type="text" placeholder="Réglementation" />
          </div>
          <div class="create-field">
            <label class="create-label">Date</label>
            <input v-model="blogForm.date" class="create-input" type="date" />
          </div>
          <div class="create-field">
            <label class="create-label">Publié</label>
            <select v-model="blogForm.published" class="create-input">
              <option :value="true">Oui</option>
              <option :value="false">Non (brouillon)</option>
            </select>
          </div>
          <div class="create-field" style="grid-column: 1/-1">
            <label class="create-label">Description courte *</label>
            <textarea v-model="blogForm.description" class="create-input create-textarea--sm" placeholder="Résumé affiché sur la liste du blog"></textarea>
          </div>
          <div class="create-field" style="grid-column: 1/-1">
            <label class="create-label">Contenu *</label>
            <div class="editor-toolbar">
              <button type="button" class="toolbar-btn" @click="insertMd('h2')">Titre</button>
              <button type="button" class="toolbar-btn" @click="insertMd('h3')">Sous-titre</button>
              <button type="button" class="toolbar-btn" @click="insertMd('li')">Liste</button>
              <button type="button" class="toolbar-btn toolbar-btn--bold" @click="insertMd('bold')">Gras</button>
            </div>
            <div class="editor-wrap">
              <textarea ref="editorRef" v-model="blogForm.raw_content" class="create-input create-textarea--lg editor-input" placeholder="Clique sur les boutons ci-dessus ou écris directement…"></textarea>
              <div class="editor-preview prose" v-html="previewHtml || '<p class=\'preview-empty\'>Prévisualisation…</p>'"></div>
            </div>
          </div>
          <div class="create-field create-field--btn" style="grid-column: 1/-1; display:flex; gap:12px">
            <button class="create-btn" :disabled="savingBlog || !blogForm.title.trim() || !blogForm.slug.trim()" @click="saveBlog">
              {{ savingBlog ? 'Enregistrement…' : (editingPost ? 'Enregistrer les modifications' : 'Publier l\'article') }}
            </button>
            <button v-if="editingPost" class="delete-btn" style="padding:10px 18px" @click="cancelEdit">Annuler</button>
          </div>
        </div>
        <p v-if="blogError" class="create-error">{{ blogError }}</p>
        <p v-if="blogSuccess" class="create-success">{{ blogSuccess }}</p>
      </div>

      <div v-if="loadingBlog" class="admin-loading">Chargement…</div>
      <div v-else-if="blogPosts.length === 0" class="admin-empty">Aucun article. Créez-en un ci-dessus.</div>
      <div v-else class="blog-admin-list">
        <div class="blog-admin-row blog-admin-row--head">
          <span>Titre</span>
          <span>Date</span>
          <span>Catégorie</span>
          <span>Statut</span>
          <span></span>
        </div>
        <div v-for="post in blogPosts" :key="post.id" class="blog-admin-row" :class="{ editing: editingPost?.id === post.id }">
          <span class="bcol-title">{{ post.title }}</span>
          <span class="bcol-date">{{ formatDate(post.date) }}</span>
          <span class="bcol-cat">{{ post.category }}</span>
          <span class="bcol-status">
            <button class="toggle-btn" :class="{ 'toggle-btn--on': post.published }" :disabled="togglingBlog[post.id]" @click="toggleBlogPost(post)">
              {{ post.published ? 'Publié' : 'Brouillon' }}
            </button>
          </span>
          <span class="bcol-actions">
            <button class="tracking-save" style="margin-right:8px" @click="startEdit(post)">Modifier</button>
            <button class="delete-btn" :disabled="deletingBlog[post.id]" @click="deletePost(post)">{{ deletingBlog[post.id] ? '…' : '✕' }}</button>
          </span>
        </div>
      </div>

    </div>

  </div>

  <Teleport to="body">
    <div v-if="showDeliveredModal" class="ship-modal-backdrop">
      <div class="ship-modal-card">
        <p class="ship-modal-eyebrow">OMEGACBD</p>
        <h2 class="ship-modal-title">Confirmer la livraison</h2>
        <div class="ship-modal-divider"></div>
        <p class="ship-modal-sub">
          Commande #{{ deliveredPendingOrder?.id.slice(0, 8) }}<br>
          La commande sera marquée comme livrée.
        </p>
        <label class="ship-modal-check">
          <input v-model="deliveredSendEmail" type="checkbox" class="ship-modal-checkbox" />
          <span>Envoyer l'email de livraison au client</span>
        </label>
        <p v-if="deliveredError" class="ship-modal-error">{{ deliveredError }}</p>
        <div class="ship-modal-actions">
          <button class="ship-modal-cancel" @click="cancelDelivered">Annuler</button>
          <button class="ship-modal-confirm" :disabled="confirmingDelivered" @click="confirmDelivered">
            {{ confirmingDelivered ? 'Confirmation…' : 'Confirmer' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <Teleport to="body">
    <div v-if="showShipModal" class="ship-modal-backdrop">
      <div class="ship-modal-card">
        <p class="ship-modal-eyebrow">OMEGACBD</p>
        <h2 class="ship-modal-title">Confirmer l'expédition</h2>
        <div class="ship-modal-divider"></div>
        <p class="ship-modal-sub">
          Commande #{{ shipPendingOrder?.id.slice(0, 8) }}<br>
          Un email de suivi sera envoyé automatiquement au client.
        </p>
        <div class="ship-modal-field">
          <label class="ship-modal-label">Numéro de suivi *</label>
          <input
            v-model="shipTrackingInput"
            class="ship-modal-input"
            type="text"
            placeholder="Ex : 1Z999AA10123456784"
            maxlength="100"
            @keyup.enter="confirmShip"
          />
        </div>
        <label class="ship-modal-check">
          <input v-model="shipSendEmail" type="checkbox" class="ship-modal-checkbox" />
          <span>Envoyer l'email d'expédition au client</span>
        </label>
        <p v-if="shippingError" class="ship-modal-error">{{ shippingError }}</p>
        <div class="ship-modal-actions">
          <button class="ship-modal-cancel" @click="cancelShip">Annuler</button>
          <button
            class="ship-modal-confirm"
            :disabled="!shipTrackingInput.trim() || confirmingShip"
            @click="confirmShip"
          >
            {{ confirmingShip ? 'Envoi en cours…' : 'Confirmer et envoyer' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
definePageMeta({ middleware: 'admin' })

const tab = ref('orders')

const activeOrders = computed(() => orders.value.filter(o => o.status !== 'delivered' && o.status !== 'cancelled'))
const historicalOrders = computed(() => orders.value.filter(o => o.status === 'delivered' || o.status === 'cancelled'))
const pendingCount = computed(() => orders.value.filter(o => o.status === 'pending').length)
const orderStatuses = reactive({})

const orders = ref([])
const promos = ref([])
const loadingOrders = ref(true)
const loadingPromos = ref(true)
const expandedOrder = ref(null)
const trackingInputs = ref({})
const savingTracking = ref({})
const togglingPromo = ref({})
const deletingPromo = ref({})

const blogPosts = ref([])
const loadingBlog = ref(true)
const savingBlog = ref(false)
const togglingBlog = ref({})
const deletingBlog = ref({})
const editingPost = ref(null)
const blogError = ref('')
const blogSuccess = ref('')

const blogForm = reactive({
  title: '',
  slug: '',
  category: 'Article',
  description: '',
  raw_content: '',
  date: new Date().toISOString().slice(0, 10),
  published: true
})

const slugify = (str) => str.toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')

const renderMarkdown = (text) => {
  if (!text) return ''
  const lines = text.split('\n')
  const html = []
  let inList = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith('### ')) {
      if (inList) { html.push('</ul>'); inList = false }
      html.push(`<h3>${line.slice(4)}</h3>`)
    } else if (line.startsWith('## ')) {
      if (inList) { html.push('</ul>'); inList = false }
      html.push(`<h2>${line.slice(3)}</h2>`)
    } else if (line.startsWith('- ')) {
      if (!inList) { html.push('<ul>'); inList = true }
      const content = line.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      html.push(`<li>${content}</li>`)
    } else if (line.trim() === '') {
      if (inList) { html.push('</ul>'); inList = false }
    } else {
      if (inList) { html.push('</ul>'); inList = false }
      const content = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      html.push(`<p>${content}</p>`)
    }
  }
  if (inList) html.push('</ul>')
  return html.join('\n')
}

const previewHtml = computed(() => renderMarkdown(blogForm.raw_content))

const editorRef = ref(null)

const insertMd = (type) => {
  const el = editorRef.value
  if (!el) return
  const start = el.selectionStart
  const end = el.selectionEnd
  const text = blogForm.raw_content
  const selected = text.slice(start, end)

  if (type === 'bold') {
    if (selected) {
      blogForm.raw_content = text.slice(0, start) + `**${selected}**` + text.slice(end)
      nextTick(() => { el.focus(); el.setSelectionRange(start + 2, end + 2) })
    } else {
      blogForm.raw_content = text.slice(0, start) + '****' + text.slice(end)
      nextTick(() => { el.focus(); el.setSelectionRange(start + 2, start + 2) })
    }
    return
  }

  const prefixes = { h2: '## ', h3: '### ', li: '- ' }
  const prefix = prefixes[type]
  const lineStart = text.lastIndexOf('\n', start - 1) + 1
  blogForm.raw_content = text.slice(0, lineStart) + prefix + text.slice(lineStart)
  nextTick(() => { el.focus(); el.setSelectionRange(start + prefix.length, end + prefix.length) })
}

const onTitleInput = () => {
  if (!editingPost.value) blogForm.slug = slugify(blogForm.title)
}

const resetBlogForm = () => {
  Object.assign(blogForm, { title: '', slug: '', category: 'Article', description: '', raw_content: '', date: new Date().toISOString().slice(0, 10), published: true })
  editingPost.value = null
  blogError.value = ''
  blogSuccess.value = ''
}

const startEdit = (post) => {
  editingPost.value = post
  Object.assign(blogForm, { title: post.title, slug: post.slug, category: post.category, description: post.description, raw_content: post.raw_content || '', date: post.date, published: post.published })
  blogError.value = ''
  blogSuccess.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelEdit = () => resetBlogForm()

const saveBlog = async () => {
  blogError.value = ''
  blogSuccess.value = ''
  savingBlog.value = true
  const content = renderMarkdown(blogForm.raw_content)
  try {
    if (editingPost.value) {
      const updated = await $fetch(`/api/admin/posts/${editingPost.value.id}`, {
        method: 'PATCH',
        body: { title: blogForm.title, slug: blogForm.slug, category: blogForm.category, description: blogForm.description, raw_content: blogForm.raw_content, content, date: blogForm.date, published: blogForm.published }
      })
      const idx = blogPosts.value.findIndex(p => p.id === editingPost.value.id)
      if (idx !== -1) blogPosts.value[idx] = updated
      blogSuccess.value = 'Article modifié.'
      resetBlogForm()
    } else {
      const newPost = await $fetch('/api/admin/posts', {
        method: 'POST',
        body: { title: blogForm.title, slug: blogForm.slug, category: blogForm.category, description: blogForm.description, raw_content: blogForm.raw_content, content, date: blogForm.date, published: blogForm.published }
      })
      blogPosts.value.unshift(newPost)
      blogSuccess.value = 'Article publié.'
      resetBlogForm()
    }
    setTimeout(() => { blogSuccess.value = '' }, 3000)
  } catch (e) {
    blogError.value = e.data?.message || 'Erreur lors de l\'enregistrement.'
  } finally {
    savingBlog.value = false
  }
}

const toggleBlogPost = async (post) => {
  togglingBlog.value[post.id] = true
  try {
    await $fetch(`/api/admin/posts/${post.id}`, { method: 'PATCH', body: { published: !post.published } })
    post.published = !post.published
  } catch { } finally {
    togglingBlog.value[post.id] = false
  }
}

const deletePost = async (post) => {
  if (!confirm(`Supprimer "${post.title}" ?`)) return
  deletingBlog.value[post.id] = true
  try {
    await $fetch(`/api/admin/posts/${post.id}`, { method: 'DELETE' })
    blogPosts.value = blogPosts.value.filter(p => p.id !== post.id)
  } catch { } finally {
    deletingBlog.value[post.id] = false
  }
}

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

const showShipModal = ref(false)
const shipPendingOrder = ref(null)
const shipPendingPrev = ref('')
const shipTrackingInput = ref('')
const shipSendEmail = ref(true)
const shippingError = ref('')
const confirmingShip = ref(false)

const showDeliveredModal = ref(false)
const deliveredPendingOrder = ref(null)
const deliveredPendingPrev = ref('')
const deliveredSendEmail = ref(true)
const deliveredError = ref('')
const confirmingDelivered = ref(false)

const toggleOrder = (id) => {
  expandedOrder.value = expandedOrder.value === id ? null : id
}

const updateStatus = async (order) => {
  const newStatus = orderStatuses[order.id]
  const prev = order.status

  if (newStatus === 'delivered') {
    deliveredPendingOrder.value = order
    deliveredPendingPrev.value = prev
    deliveredSendEmail.value = tab.value !== 'history'
    deliveredError.value = ''
    showDeliveredModal.value = true
    return
  }

  if (newStatus === 'shipped') {
    shipPendingOrder.value = order
    shipPendingPrev.value = prev
    shipTrackingInput.value = trackingInputs.value[order.id] || ''
    shipSendEmail.value = !order.tracking_number
    shippingError.value = ''
    showShipModal.value = true
    return
  }

  const labels = { pending: 'En attente', paid: 'Payé', delivered: 'Livré', cancelled: 'Annulé' }
  if (!confirm(`Passer la commande #${order.id.slice(0, 8)} en "${labels[newStatus] ?? newStatus}" ?`)) {
    orderStatuses[order.id] = prev
    return
  }

  try {
    await $fetch(`/api/admin/orders/${order.id}`, { method: 'PATCH', body: { status: newStatus } })
    order.status = newStatus
  } catch (e) {
    console.error('Erreur statut:', e)
    orderStatuses[order.id] = prev
  }
}

const confirmShip = async () => {
  if (!shipTrackingInput.value.trim()) return
  confirmingShip.value = true
  shippingError.value = ''
  const order = shipPendingOrder.value
  try {
    await $fetch(`/api/admin/orders/${order.id}`, {
      method: 'PATCH',
      body: { status: 'shipped', tracking_number: shipTrackingInput.value.trim(), send_email: shipSendEmail.value }
    })
    order.status = 'shipped'
    order.tracking_number = shipTrackingInput.value.trim()
    trackingInputs.value[order.id] = shipTrackingInput.value.trim()
    orderStatuses[order.id] = 'shipped'
    showShipModal.value = false
  } catch (e) {
    shippingError.value = e.data?.message || 'Erreur lors de la mise à jour.'
    orderStatuses[order.id] = shipPendingPrev.value
  } finally {
    confirmingShip.value = false
  }
}

const cancelShip = () => {
  if (shipPendingOrder.value) {
    orderStatuses[shipPendingOrder.value.id] = shipPendingPrev.value
  }
  showShipModal.value = false
  shipPendingOrder.value = null
  shippingError.value = ''
}

const confirmDelivered = async () => {
  confirmingDelivered.value = true
  deliveredError.value = ''
  const order = deliveredPendingOrder.value
  try {
    await $fetch(`/api/admin/orders/${order.id}`, {
      method: 'PATCH',
      body: { status: 'delivered', send_email: deliveredSendEmail.value }
    })
    order.status = 'delivered'
    orderStatuses[order.id] = 'delivered'
    showDeliveredModal.value = false
  } catch (e) {
    deliveredError.value = e.data?.message || 'Erreur lors de la mise à jour.'
    orderStatuses[order.id] = deliveredPendingPrev.value
  } finally {
    confirmingDelivered.value = false
  }
}

const cancelDelivered = () => {
  if (deliveredPendingOrder.value) {
    orderStatuses[deliveredPendingOrder.value.id] = deliveredPendingPrev.value
  }
  showDeliveredModal.value = false
  deliveredPendingOrder.value = null
  deliveredError.value = ''
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

const deletePromo = async (promo) => {
  if (!confirm(`Supprimer le code "${promo.code}" ?`)) return
  deletingPromo.value[promo.id] = true
  try {
    await $fetch(`/api/admin/promos/${promo.id}`, { method: 'DELETE' })
    promos.value = promos.value.filter(p => p.id !== promo.id)
  } catch {
    // silencieux
  } finally {
    deletingPromo.value[promo.id] = false
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
    const [o, p, b] = await Promise.all([
      $fetch('/api/admin/orders'),
      $fetch('/api/admin/promos'),
      $fetch('/api/admin/posts')
    ])
    orders.value = o || []
    promos.value = p || []
    blogPosts.value = b || []
    for (const order of orders.value) {
      trackingInputs.value[order.id] = order.tracking_number || ''
      orderStatuses[order.id] = order.status
    }
  } catch (e) {
    if (e?.status === 401 || e?.status === 403) {
      navigateTo('/')
      return
    }
  } finally {
    loadingOrders.value = false
    loadingPromos.value = false
    loadingBlog.value = false
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

.hero-pending {
  color: var(--gold);
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

.status-select.s-pending   { color: var(--gold); }
.status-select.s-paid      { color: #ed8936; }
.status-select.s-shipped   { color: #4299e1; }
.status-select.s-delivered { color: #48bb78; }
.status-select.s-cancelled { color: #e53e3e; }

.status-select option[value="pending"]   { color: var(--gold); }
.status-select option[value="paid"]      { color: #ed8936; }
.status-select option[value="shipped"]   { color: #4299e1; }
.status-select option[value="delivered"] { color: #48bb78; }
.status-select option[value="cancelled"] { color: #e53e3e; }

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
  grid-template-columns: 1fr 100px 90px 90px 110px 90px 32px;
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

.delete-btn {
  background: none;
  border: none;
  color: var(--color-text-subtle);
  font-size: 13px;
  cursor: pointer;
  padding: 4px;
  transition: color var(--transition);
  line-height: 1;
}

.delete-btn:hover:not(:disabled) { color: #e53e3e; }
.delete-btn:disabled { opacity: 0.4; cursor: not-allowed; }

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

/* ── MODAL EXPÉDITION ── */

.ship-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.ship-modal-card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  padding: 48px;
  max-width: 480px;
  width: 100%;
  text-align: center;
}

.ship-modal-eyebrow {
  font-size: var(--fs-tiny);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 12px;
}

.ship-modal-title {
  font-family: var(--font-display);
  font-size: clamp(24px, 4vw, 32px);
  font-weight: 300;
  color: var(--color-text);
  margin-bottom: 16px;
}

.ship-modal-divider {
  width: 40px;
  height: 1px;
  background: var(--gold);
  margin: 0 auto 20px;
}

.ship-modal-sub {
  font-size: var(--fs-small);
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 28px;
}

.ship-modal-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
  margin-bottom: 8px;
}

.ship-modal-label {
  font-size: var(--fs-tiny);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
}

.ship-modal-input {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: var(--fs-body);
  padding: 12px 14px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  letter-spacing: 0.05em;
  transition: border-color var(--transition);
}

.ship-modal-input:focus { border-color: var(--gold); }

.ship-modal-check {
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  margin-top: 14px;
  cursor: pointer;
  font-size: var(--fs-small);
  color: var(--color-text-muted);
}

.ship-modal-checkbox {
  accent-color: var(--gold);
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  cursor: pointer;
}

.ship-modal-error {
  font-size: var(--fs-small);
  color: #e53e3e;
  text-align: left;
  margin-top: 4px;
  margin-bottom: 4px;
}

.ship-modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.ship-modal-cancel {
  flex: 1;
  padding: 12px;
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-family: var(--font-body);
  font-size: var(--fs-label);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all var(--transition);
}

.ship-modal-cancel:hover {
  border-color: var(--color-text-muted);
  color: var(--color-text);
}

.ship-modal-confirm {
  flex: 2;
  padding: 12px;
  background: var(--gold);
  border: 1px solid var(--gold);
  color: #0a0a0a;
  font-family: var(--font-body);
  font-size: var(--fs-label);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all var(--transition);
}

.ship-modal-confirm:hover:not(:disabled) { background: transparent; color: var(--gold); }
.ship-modal-confirm:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── BLOG ADMIN ── */
.blog-admin-form {
  border: 1px solid var(--color-border);
  padding: 28px;
  margin-bottom: 32px;
  background: var(--color-surface);
  transition: background var(--transition);
}

.blog-form-title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 400;
  color: var(--color-text);
  margin-bottom: 20px;
}

.blog-form-hint {
  font-size: var(--fs-xs);
  color: var(--color-text-subtle);
  margin-bottom: 6px;
}

.blog-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.create-textarea--sm {
  height: 80px;
  resize: vertical;
  font-family: var(--font-body);
  line-height: 1.5;
}

.create-textarea--lg {
  height: 220px;
  resize: vertical;
  font-family: monospace;
  font-size: 13px;
  line-height: 1.6;
}

.blog-admin-list {
  border: 1px solid var(--color-border);
  overflow-x: auto;
}

.blog-admin-row {
  display: grid;
  grid-template-columns: 1fr 110px 120px 110px 120px;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  align-items: center;
  font-size: var(--fs-small);
  color: var(--color-text-muted);
  transition: background var(--transition);
}

.blog-admin-row--head {
  font-size: var(--fs-tiny);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
  background: var(--color-surface);
}

.blog-admin-row.editing {
  background: color-mix(in srgb, var(--gold) 5%, var(--color-bg));
}

.blog-admin-row:last-child { border-bottom: none; }

.bcol-title {
  font-weight: 500;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bcol-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

@media (max-width: 768px) {
  .blog-form-grid { grid-template-columns: 1fr; }
  .blog-admin-row { grid-template-columns: 1fr 80px 80px; }
  .bcol-date, .bcol-cat { display: none; }
}

/* ── EDITOR MARKDOWN ── */
.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.toolbar-btn {
  padding: 5px 14px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-family: var(--font-body);
  font-size: var(--fs-tiny);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all var(--transition);
}

.toolbar-btn:hover {
  border-color: var(--gold);
  color: var(--gold);
}

.toolbar-btn--bold {
  font-weight: 700;
}

.editor-wrap {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border: 1px solid var(--color-border);
}

.editor-input {
  border: none !important;
  border-right: 1px solid var(--color-border) !important;
  border-radius: 0;
  resize: vertical;
  min-height: 260px;
}

.editor-input:focus {
  border-color: var(--color-border) !important;
  outline: none;
}

.editor-preview {
  padding: 12px 16px;
  min-height: 260px;
  overflow-y: auto;
  font-size: var(--fs-small);
  color: var(--color-text-muted);
  background: var(--color-surface);
  line-height: 1.75;
}

.editor-preview :deep(h2) {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 400;
  color: var(--color-text);
  margin: 16px 0 8px;
}

.editor-preview :deep(h3) {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 400;
  color: var(--color-text);
  margin: 12px 0 6px;
}

.editor-preview :deep(p) {
  margin-bottom: 10px;
}

.editor-preview :deep(ul) {
  margin: 0 0 10px 20px;
}

.editor-preview :deep(li) {
  margin-bottom: 4px;
}

.editor-preview :deep(strong) {
  color: var(--color-text);
  font-weight: 600;
}

.editor-preview :deep(.preview-empty) {
  font-style: italic;
  color: var(--color-text-subtle) !important;
}

@media (max-width: 900px) {
  .editor-wrap { grid-template-columns: 1fr; }
  .editor-input { border-right: none !important; border-bottom: 1px solid var(--color-border) !important; }
}
</style>
