<template>
  <div class="product-detail-page">

    <div class="breadcrumb container">
      <NuxtLink to="/" class="breadcrumb__link">Accueil</NuxtLink>
      <span class="breadcrumb__sep">›</span>
      <NuxtLink :to="product.collectionPath" class="breadcrumb__link">{{ product.collectionLabel }}</NuxtLink>
      <span class="breadcrumb__sep">›</span>
      <span class="breadcrumb__current">{{ product.name }}</span>
    </div>

    <div class="product-main container">
      <div class="product-main__image-col">
        <div class="product-main__image-wrap">
          <img :src="product.image" :alt="product.name" class="product-main__image" />
          <span class="product-main__badge">{{ product.badge }}</span>
        </div>
      </div>

      <div class="product-main__info-col">
        <p class="product-main__eyebrow">OMEGACBD — {{ product.collectionLabel.toUpperCase() }}</p>
        <h1 class="product-main__name">{{ product.name }}</h1>
        <div class="product-main__divider"></div>

        <div class="product-main__rates">
          <div class="rate">
            <span class="rate__label">CBD</span>
            <span class="rate__value">{{ product.cbd }}</span>
          </div>
          <div class="rate">
            <span class="rate__label">THC</span>
            <span class="rate__value">&lt; 0.3%</span>
          </div>
          <div class="rate">
            <span class="rate__label">Origine</span>
            <span class="rate__value">{{ product.origine }}</span>
          </div>
        </div>

        <p class="product-main__desc">{{ product.desc }}</p>

        <div class="product-main__aromes">
          <span v-for="a in product.aromes" :key="a" class="arome-tag">{{ a }}</span>
        </div>

        <div class="product-main__prices">
          <button
            v-for="opt in product.prices"
            :key="opt.weight"
            class="price-option"
            :class="{ selected: selectedWeight === opt.weight }"
            @click="selectedWeight = opt.weight"
          >
            <span class="price-option__weight">{{ opt.weight }}</span>
            <span class="price-option__price">{{ opt.price.toFixed(2).replace('.', ',') }} €</span>
          </button>
        </div>

        <button class="product-main__cta" :class="{ added }" @click="addToCart">
          {{ added ? 'Ajouté au panier ✓' : 'Ajouter au panier' }}
        </button>

        <NuxtLink :to="product.collectionPath" class="product-main__back">
          ← Retour à la {{ product.collectionLabel }}
        </NuxtLink>
      </div>
    </div>

    <div class="legal-block container">
      <p>
        Tous nos produits sont conformes au décret français n°2021-1247 relatif au chanvre et à la réglementation
        européenne sur les produits dérivés du cannabis. Taux de THC inférieur à 0.3% certifié par analyses
        en laboratoire accrédité. Produits destinés exclusivement aux adultes majeurs. Non médicamenteux —
        ces produits ne sont pas destinés à diagnostiquer, traiter, guérir ou prévenir une maladie.
      </p>
    </div>

  </div>
</template>

<script setup>
import { getProductBySlug } from '~/data/products'

const route = useRoute()
const { add, load } = useCart()
const router = useRouter()
const user = useSupabaseUser()
onMounted(load)

const product = getProductBySlug(route.params.slug)
if (!product) {
  throw createError({ statusCode: 404, statusMessage: 'Produit introuvable' })
}

useHead({
  title: `${product.name} — OMEGACBD`,
  meta: [{ name: 'description', content: product.desc.slice(0, 155) }]
})

const selectedWeight = ref(product.prices[0].weight)
const added = ref(false)

const addToCart = () => {
  if (!user.value) { router.push('/compte/connexion'); return }
  const price = product.prices.find(p => p.weight === selectedWeight.value)?.price || 0
  add({ productId: product.id, name: product.name, weight: selectedWeight.value, price, image: product.image })
  added.value = true
  setTimeout(() => { added.value = false }, 1500)
}
</script>

<style scoped>
.product-detail-page {
  padding-top: var(--navbar-height);
  padding-bottom: 80px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px 24px;
  font-size: var(--fs-tiny);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.breadcrumb__link {
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color var(--transition);
}

.breadcrumb__link:hover {
  color: var(--gold);
}

.breadcrumb__sep {
  color: var(--color-border);
}

.breadcrumb__current {
  color: var(--gold);
}

.product-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  padding: 40px 24px 60px;
  align-items: start;
}

.product-main__image-col {
  position: sticky;
  top: calc(var(--navbar-height) + 20px);
}

.product-main__image-wrap {
  position: relative;
  background: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  min-height: 420px;
  transition: background var(--transition);
}

.product-main__image {
  max-height: 380px;
  width: auto;
  max-width: 100%;
  object-fit: contain;
}

.product-main__badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #0d1a0d;
  color: var(--gold);
  font-size: var(--fs-tiny);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 6px 12px;
}

.product-main__info-col {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.product-main__eyebrow {
  font-size: var(--fs-tiny);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 14px;
}

.product-main__name {
  font-family: var(--font-display);
  font-size: clamp(36px, 4vw, 56px);
  font-weight: 300;
  color: var(--color-text);
  margin-bottom: 20px;
  line-height: 1.1;
  transition: color var(--transition);
}

.product-main__divider {
  width: 40px;
  height: 1px;
  background: var(--gold);
  margin-bottom: 24px;
}

.product-main__rates {
  display: flex;
  gap: 28px;
  margin-bottom: 24px;
  padding: 16px 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.rate {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rate__label {
  font-size: 9px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
}

.rate__value {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 500;
  color: var(--color-text);
  transition: color var(--transition);
}

.product-main__desc {
  font-size: var(--fs-body);
  color: var(--color-text-muted);
  line-height: 1.85;
  margin-bottom: 24px;
  transition: color var(--transition);
}

.product-main__aromes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
}

.arome-tag {
  font-size: var(--fs-tiny);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 5px 12px;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
}

.product-main__prices {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.price-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 18px;
  background: var(--color-surface);
  flex: 1;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background var(--transition), border-color var(--transition);
}

.price-option__weight {
  font-size: var(--fs-tiny);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
  margin-bottom: 6px;
}

.price-option__price {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 500;
  color: var(--color-text);
  transition: color var(--transition);
}

.price-option.selected {
  border-color: var(--gold);
  background: var(--color-bg);
}

.price-option.selected .price-option__price {
  color: var(--gold);
}

.product-main__cta {
  display: block;
  width: 100%;
  text-align: center;
  padding: 16px;
  background: var(--color-text);
  color: var(--color-bg);
  cursor: pointer;
  border: none;
  font-family: var(--font-body);
  font-size: var(--fs-label);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  transition: background var(--transition);
  margin-bottom: 20px;
}

.product-main__cta:hover {
  background: var(--gold);
  color: var(--white);
}

.product-main__cta.added {
  background: var(--gold);
  color: var(--white);
}

.product-main__back {
  font-size: var(--fs-tiny);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color var(--transition);
}

.product-main__back:hover {
  color: var(--gold);
}

.legal-block {
  border: 1px solid var(--color-border);
  padding: 24px 28px;
  background: var(--color-surface);
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  transition: background var(--transition);
}

.legal-block p {
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
  line-height: 1.8;
}

@media (max-width: 900px) {
  .product-main {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .product-main__image-col {
    position: static;
  }

  .product-main__image-wrap {
    min-height: 300px;
    padding: 32px;
  }

  .product-main__image {
    max-height: 280px;
  }

  .legal-block {
    margin: 0 24px;
  }
}

@media (max-width: 480px) {
  .product-main {
    padding: 24px 16px 40px;
  }

  .product-main__prices {
    gap: 8px;
  }

  .legal-block {
    margin: 0 16px;
  }
}
</style>
