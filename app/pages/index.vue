<template>
  <div class="home">

    <!-- HERO -->
    <section class="hero">
      <div class="hero__content">
        <p class="hero__eyebrow">Collection Premium</p>
        <h1 class="hero__title">L'excellence du CBD,<br><em>à l'état pur.</em></h1>
        <div class="hero__logo-center">
          <img src="/logo.png" alt="OMEGACBD" class="hero__logo-img" />
        </div>
        <p class="hero__subtitle">Fleurs de CBD soigneusement sélectionnées pour leur qualité exceptionnelle.<br>Cultivées en indoor, testées en laboratoire.</p>
        <div class="hero__actions">
          <NuxtLink to="/produits/cbd" class="btn btn--primary">Découvrir nos produits</NuxtLink>
          <NuxtLink to="/infos" class="btn btn--ghost">En savoir plus</NuxtLink>
        </div>
        <div class="hero__badge">
          <span>THC</span>
          <strong>&lt; 0.3%</strong>
          <span>Légal en France</span>
        </div>
      </div>
    </section>

    <!-- COLLECTIONS -->
    <section class="collections">
      <div class="container">
        <div class="section-header">
          <p class="section-eyebrow">Nos Gammes</p>
          <h2 class="section-title">Deux collections d'exception</h2>
        </div>
        <div class="collections__grid">
          <NuxtLink to="/produits/cbd" class="collection-card collection-card--jsh">
            <div class="collection-card__body">
              <p class="collection-card__tag">Indoor Premium</p>
              <h3 class="collection-card__title">Collection CBD</h3>
              <p class="collection-card__desc">Amnesia Haze, Mango Haze, Purple Haze — des souches emblématiques cultivées avec soin pour révéler leur plein potentiel aromatique.</p>
              <span class="collection-card__link">Voir la collection →</span>
            </div>
          </NuxtLink>

          <NuxtLink to="/produits/thx" class="collection-card collection-card--thx">
            <div class="collection-card__body">
              <p class="collection-card__tag">Sélection Exclusive</p>
              <h3 class="collection-card__title">Collection THX</h3>
              <p class="collection-card__desc">Alien OG, Fantasy, Euphoria — une gamme haut de gamme pour les connaisseurs en quête d'expériences sensorielles uniques.</p>
              <span class="collection-card__link">Voir la collection →</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ENGAGEMENTS -->
    <section class="engagements">
      <div class="container">
        <div class="section-header">
          <p class="section-eyebrow">Nos engagements</p>
          <h2 class="section-title">Qualité sans compromis</h2>
        </div>
        <div class="engagements__grid">
          <div class="engagement">
            <div class="engagement__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3 class="engagement__title">Qualité certifiée</h3>
            <p class="engagement__text">Chaque produit est analysé en laboratoire indépendant. Taux de CBD et THC garantis sur chaque lot.</p>
          </div>

          <div class="engagement">
            <div class="engagement__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4l3 3"/>
              </svg>
            </div>
            <h3 class="engagement__title">Traçabilité totale</h3>
            <p class="engagement__text">De la culture à la livraison, chaque étape est contrôlée. Origine certifiée, conformité légale totale.</p>
          </div>

          <div class="engagement">
            <div class="engagement__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h3 class="engagement__title">Culture responsable</h3>
            <p class="engagement__text">Nos partenaires cultivateurs appliquent des pratiques agricoles respectueuses de l'environnement et du consommateur.</p>
          </div>

          <div class="engagement">
            <div class="engagement__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                <rect x="1" y="3" width="15" height="13" rx="1"/>
                <path d="M16 8h4l3 3v5h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
            <h3 class="engagement__title">Livraison sécurisée</h3>
            <p class="engagement__text">Emballage discret, expédition soignée. Votre commande traitée dans les 24h ouvrées.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA BAND -->
    <section class="cta-band">
      <div class="container">
        <h2 class="cta-band__title">Un projet sérieux,<br><em>une marque de confiance.</em></h2>
        <p class="cta-band__text">OMEGACBD s'engage à proposer uniquement des produits conformes à la réglementation française et européenne en vigueur.</p>
        <NuxtLink to="/contact" class="btn btn--gold">Nous contacter</NuxtLink>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* HERO */
.hero {
  background: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: calc(var(--navbar-height) + 80px) 24px 40px;
  text-align: center;
  transition: background var(--transition);
}

.hero__content {
  max-width: 700px;
}

.hero__eyebrow {
  font-size: 11px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 24px;
}

.hero__title {
  font-family: var(--font-display);
  font-size: clamp(48px, 7vw, 84px);
  font-weight: 300;
  color: var(--color-text);
  line-height: 1.1;
  margin-bottom: 28px;
}

.hero__title em {
  font-style: italic;
  color: var(--gold);
}

.hero__divider {
  width: 60px;
  height: 1px;
  background: var(--gold);
  margin: 0 auto 28px;
}

.hero__logo-center {
  display: flex;
  justify-content: center;
  margin: -20px auto 0px;
}

.hero__logo-img {
  width: 280px;
  height: 280px;
  object-fit: contain;
}

.hero__subtitle {
  font-size: 16px;
  color: var(--color-text-muted);
  line-height: 1.8;
  margin-bottom: 40px;
}

.hero__actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.hero__badge {
  display: inline-flex;
  flex-direction: column;
  gap: 2px;
  border: 1px solid var(--color-border);
  padding: 12px 20px;
  text-align: center;
  margin-top: 46px;
}

.hero__badge span {
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
}

.hero__badge strong {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 400;
  color: var(--gold);
}

/* BUTTONS */
.btn {
  display: inline-block;
  padding: 14px 32px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  transition: all var(--transition);
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
}
.btn--ghost:hover {
  border-color: var(--gold);
  color: var(--gold);
}

.btn--gold {
  background: var(--gold);
  color: var(--white);
}
.btn--gold:hover {
  background: #b8935a;
}

/* SECTIONS */
.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-eyebrow {
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 24px;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 300;
  color: var(--color-text);
}

/* COLLECTIONS */
.collections {
  padding: 40px 0 60px;
  background: var(--color-bg);
  transition: background var(--transition);
}

.collections__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.collection-card {
  display: block;
  position: relative;
  min-height: 340px;
  overflow: hidden;
  background: var(--grey-100);
  transition: transform var(--transition);
}

.collection-card:hover {
  transform: translateY(-4px);
}

.collection-card--jsh {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.collection-card--thx {
  background: linear-gradient(135deg, #1a2e1a 0%, #162116 50%, #0f3412 100%);
}

.collection-card__body {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 36px;
  background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%);
}

.collection-card__tag {
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 8px;
}

.collection-card__title {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 400;
  color: var(--white);
  margin-bottom: 12px;
}

.collection-card__desc {
  font-size: 14px;
  color: rgba(255,255,255,0.6);
  line-height: 1.7;
  margin-bottom: 20px;
}

.collection-card__link {
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold);
  transition: letter-spacing var(--transition);
}

.collection-card:hover .collection-card__link {
  letter-spacing: 0.2em;
}

/* ENGAGEMENTS */
.engagements {
  padding: 100px 0;
  background: var(--color-surface);
  transition: background var(--transition);
}

.engagements__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}

.engagement {
  text-align: center;
  padding: 32px 16px;
}

.engagement__icon {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  color: var(--gold);
}

.engagement__title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 12px;
  color: var(--color-text);
}

.engagement__text {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.7;
}

/* CTA BAND */
.cta-band {
  padding: 40px 0 80px;
  background: var(--color-surface);
  text-align: center;
  transition: background var(--transition);
}

.cta-band__title {
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 300;
  color: var(--color-text);
  margin-bottom: 20px;
}

.cta-band__title em {
  font-style: italic;
  color: var(--gold);
}

.cta-band__text {
  font-size: 15px;
  color: var(--color-text-muted);
  max-width: 560px;
  margin: 0 auto 36px;
  line-height: 1.8;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .engagements__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .collections__grid {
    grid-template-columns: 1fr;
  }
  .engagements__grid {
    grid-template-columns: 1fr;
  }
}
</style>
