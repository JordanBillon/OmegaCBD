<template>
  <footer class="footer">
    <div class="footer__top container">
      <div class="footer__brand">
        <img src="/logo.webp" alt="OMEGACBD" class="footer__logo" />
        <p class="footer__tagline">CBD premium, sélectionné avec soin.</p>
        <p class="footer__legal-note">Produits légaux — Taux THC &lt; 0.3% conformément à la législation française en vigueur.</p>
      </div>

      <div class="footer__links">
        <div class="footer__col">
          <h4 class="footer__col-title">Navigation</h4>
          <NuxtLink to="/" class="footer__link">Accueil</NuxtLink>
          <NuxtLink to="/produits/cbd" class="footer__link">Collection CBD</NuxtLink>
          <NuxtLink to="/produits/thx" class="footer__link">Collection THX</NuxtLink>
          <NuxtLink to="/infos" class="footer__link">Infos</NuxtLink>
          <NuxtLink to="/contact" class="footer__link">Contact</NuxtLink>
        </div>

        <div class="footer__col">
          <h4 class="footer__col-title">Informations</h4>
          <NuxtLink to="/infos#mentions-legales" class="footer__link">Mentions légales</NuxtLink>
          <NuxtLink to="/infos#cgv" class="footer__link">CGV</NuxtLink>
          <NuxtLink to="/infos#confidentialite" class="footer__link">Politique de confidentialité</NuxtLink>
          <NuxtLink to="/infos#cbd" class="footer__link">À propos du CBD</NuxtLink>
        </div>

        <div class="footer__col">
          <h4 class="footer__col-title">Contact</h4>
          <p class="footer__text">contact@omegacbd.fr</p>
          <p class="footer__text">Du lundi au vendredi<br>9h – 18h</p>
        </div>
      </div>
    </div>

    <div class="footer__bottom container">
      <p class="footer__copy">© {{ new Date().getFullYear() }} OMEGACBD — Tous droits réservés</p>
      <p class="footer__age">⚠ Interdit aux mineurs de moins de 18 ans</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--black);
  color: var(--grey-400);
  padding-top: 60px;
}

.footer__top {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 60px;
  padding-bottom: 48px;
  border-bottom: 1px solid #1e1e1e;
}

.footer__logo {
  height: 40px;
  width: auto;
  object-fit: contain;
  margin-bottom: 16px;
  filter: brightness(0) invert(1);
  opacity: 0.85;
}

.footer__tagline {
  font-family: var(--font-display);
  font-size: 16px;
  font-style: italic;
  color: var(--grey-400);
  margin-bottom: 12px;
}

.footer__legal-note {
  font-size: 11px;
  color: #555;
  line-height: 1.7;
  max-width: 280px;
}

.footer__links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.footer__col-title {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--white);
  margin-bottom: 16px;
}

.footer__link {
  display: block;
  font-size: 13px;
  color: var(--grey-600);
  margin-bottom: 10px;
  transition: color var(--transition);
}

.footer__link:hover {
  color: var(--gold);
}

.footer__text {
  font-size: 13px;
  color: var(--grey-600);
  margin-bottom: 10px;
  line-height: 1.6;
}

.footer__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.footer__copy,
.footer__age {
  font-size: 11px;
  color: #444;
}

@media (max-width: 768px) {
  .footer__top {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .footer__links {
    grid-template-columns: 1fr 1fr;
  }

  .footer__bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .footer__links {
    grid-template-columns: 1fr;
  }
}
</style>
