<template>
  <div class="products-page">

    <div class="page-hero">
      <p class="page-hero__eyebrow">OMEGACBD</p>
      <h1 class="page-hero__title">Collection THX</h1>
      <div class="page-hero__divider"></div>
      <p class="page-hero__sub">Sélection Exclusive — Réservé aux connaisseurs</p>
    </div>

    <div class="products-section container">
      <div class="products-grid">
        <article v-for="product in products" :key="product.id" class="product-card">
          <NuxtLink :to="`/produits/${product.slug}`" class="product-card__image-wrap">
            <img :src="product.image" :alt="product.name" class="product-card__image" />
            <span class="product-card__badge">{{ product.badge }}</span>
          </NuxtLink>
          <div class="product-card__body">
            <p class="product-card__tag">Collection THX</p>
            <NuxtLink :to="`/produits/${product.slug}`" class="product-card__name-link">
              <h2 class="product-card__name">{{ product.name }}</h2>
            </NuxtLink>
            <div class="product-card__rates">
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
            <p class="product-card__desc">{{ product.desc }}</p>
            <div class="product-card__aromes">
              <span v-for="a in product.aromes" :key="a" class="arome-tag">{{ a }}</span>
            </div>
            <div class="product-card__prices">
              <button
                v-for="opt in product.prices"
                :key="opt.weight"
                class="price-option"
                :class="{ selected: selected[product.id] === opt.weight }"
                @click="selected[product.id] = opt.weight"
              >
                <span class="price-option__weight">{{ opt.weight }}</span>
                <span class="price-option__price">{{ opt.price.toFixed(2).replace('.', ',') }} €</span>
              </button>
            </div>
            <button class="product-card__cta" :class="{ added: added[product.id] }" @click="addToCart(product)">
              {{ added[product.id] ? 'Ajouté ✓' : 'Ajouter au panier' }}
            </button>
          </div>
        </article>
      </div>

      <div class="legal-block">
        <p>
          Tous nos produits sont conformes au décret français n°2021-1247 relatif au chanvre et à la réglementation
          européenne sur les produits dérivés du cannabis. Taux de THC inférieur à 0.3% certifié par analyses
          en laboratoire accrédité. Produits destinés exclusivement aux adultes majeurs. Non médicamenteux —
          ces produits ne sont pas destinés à diagnostiquer, traiter, guérir ou prévenir une maladie.
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { getProductsByCollection } from '~/data/products'

const { add, load } = useCart()
const router = useRouter()
const user = useSupabaseUser()
onMounted(load)

const products = getProductsByCollection('thx')

const selected = reactive(Object.fromEntries(products.map(p => [p.id, '2g'])))
const added = reactive(Object.fromEntries(products.map(p => [p.id, false])))

const addToCart = (product) => {
  if (!user.value) { router.push('/compte/connexion'); return }
  const weight = selected[product.id]
  const price = product.prices.find(p => p.weight === weight)?.price || 0
  add({ productId: product.id, name: product.name, weight, price, image: product.image })
  added[product.id] = true
  setTimeout(() => { added[product.id] = false }, 1500)
}
</script>

<style scoped>
.products-page {
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
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  transition: color var(--transition);
}

.products-section {
  padding: 80px 24px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-bottom: 60px;
}

.product-card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  transition: box-shadow var(--transition), transform var(--transition), background var(--transition);
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  box-shadow: 0 12px 40px rgba(0,0,0,0.1);
  transform: translateY(-4px);
}

.product-card__name-link {
  text-decoration: none;
  color: inherit;
}

.product-card__name-link:hover .product-card__name {
  color: var(--gold);
}

.product-card__image-wrap {
  position: relative;
  background: var(--color-surface);
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-decoration: none;
}

.product-card__image {
  height: 220px;
  width: auto;
  object-fit: contain;
  transition: transform 0.4s ease;
}

.product-card:hover .product-card__image {
  transform: scale(1.04);
}

.product-card__badge {
  position: absolute;
  top: 14px;
  right: 14px;
  background: #0d1a0d;
  color: var(--gold);
  font-size: var(--fs-tiny);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 5px 10px;
}

.product-card__body {
  padding: 28px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-card__tag {
  font-size: var(--fs-tiny);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 6px;
}

.product-card__name {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 400;
  color: var(--color-text);
  margin-bottom: 16px;
}

.product-card__rates {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  padding: 12px 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.rate {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rate__label {
  font-size: 9px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
}

.rate__value {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 500;
  color: var(--color-text);
}

.product-card__desc {
  font-size: var(--fs-small);
  color: var(--color-text-muted);
  line-height: 1.75;
  margin-bottom: 16px;
  flex: 1;
}

.product-card__aromes {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 20px;
}

.arome-tag {
  font-size: var(--fs-tiny);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 10px;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
}

.product-card__prices {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.price-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 14px;
  background: var(--color-surface);
  flex: 1;
  transition: background var(--transition);
}

.price-option__weight {
  font-size: var(--fs-tiny);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
  margin-bottom: 4px;
}

.price-option__price {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 500;
  color: var(--color-text);
}

.price-option.selected {
  border: 1px solid var(--gold);
  background: var(--color-bg);
}

.price-option.selected .price-option__price {
  color: var(--gold);
}

.product-card__cta {
  display: block;
  width: 100%;
  text-align: center;
  padding: 13px;
  background: var(--color-text);
  color: var(--color-bg);
  cursor: pointer;
  border: none;
  font-family: var(--font-body);
  font-size: var(--fs-label);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  transition: background var(--transition);
}

.product-card__cta:hover {
  background: var(--gold);
  color: var(--white);
}

.product-card__cta.added {
  background: var(--gold);
  color: var(--white);
}

.legal-block {
  border: 1px solid var(--color-border);
  padding: 24px 28px;
  background: var(--color-surface);
  transition: background var(--transition);
}

.legal-block p {
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
  line-height: 1.8;
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
