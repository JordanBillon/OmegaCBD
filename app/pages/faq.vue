<template>
  <div class="faq-page">

    <div class="page-hero">
      <p class="page-hero__eyebrow">OMEGACBD</p>
      <h1 class="page-hero__title">Questions fréquentes</h1>
      <div class="page-hero__divider"></div>
      <p class="page-hero__sub">Tout ce que vous devez savoir sur le CBD et nos produits.</p>
    </div>

    <div class="faq-section container">

      <div v-for="(section, si) in faq" :key="si" class="faq-group">
        <h2 class="faq-group__title">{{ section.title }}</h2>
        <div class="faq-list">
          <div
            v-for="(item, ii) in section.items"
            :key="ii"
            class="faq-item"
            :class="{ open: isOpen(si, ii) }"
          >
            <button class="faq-question" @click="toggle(si, ii)">
              <span>{{ item.q }}</span>
              <svg class="faq-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            <div class="faq-answer">
              <p>{{ item.a }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="faq-cta">
        <p class="faq-cta__text">Vous n'avez pas trouvé votre réponse ?</p>
        <NuxtLink to="/contact" class="faq-cta__btn">Contactez-nous →</NuxtLink>
      </div>

    </div>

  </div>
</template>

<script setup>
const openItem = ref(null)

const isOpen = (si, ii) => openItem.value === `${si}-${ii}`
const toggle = (si, ii) => {
  const key = `${si}-${ii}`
  openItem.value = openItem.value === key ? null : key
}

const faq = [
  {
    title: 'Légalité & sécurité',
    items: [
      {
        q: 'Le CBD est-il légal en France ?',
        a: 'Oui. Conformément au décret n°2021-1247, la vente et la consommation de CBD sont légales en France, à condition que le taux de THC soit inférieur à 0,3 %. Tous nos produits respectent strictement cette réglementation.'
      },
      {
        q: 'Puis-je conduire après avoir consommé du CBD ?',
        a: 'Le CBD ne provoque pas d\'altération de la vigilance et n\'est pas détecté par les tests salivaires utilisés par les forces de l\'ordre, qui ciblent uniquement le THC. Cependant, par prudence, nous vous déconseillons toute consommation avant de prendre le volant.'
      },
      {
        q: 'Le CBD apparaît-il sur un test salivaire ou urinaire ?',
        a: 'Les tests de dépistage standard recherchent le THC, pas le CBD. Nos produits contenant moins de 0,3 % de THC, le risque est extrêmement faible. Toutefois, une consommation importante et répétée peut théoriquement laisser des traces infimes de THC dans un test urinaire très sensible.'
      },
    ]
  },
  {
    title: 'Nos produits',
    items: [
      {
        q: 'Quelle est la différence entre la collection CBD (JSH) et la collection THX ?',
        a: 'La collection JSH regroupe nos fleurs de CBD cultivées en intérieur (indoor) ou sous serre (greenhouse), offrant des arômes intenses et une qualité constante. La collection THX est notre gamme premium, sélectionnée pour ses taux de CBD plus élevés et ses profils aromatiques exceptionnels. Les deux collections ont un taux de THC inférieur à 0,3 %.'
      },
      {
        q: 'Comment conserver mes fleurs de CBD ?',
        a: 'Conservez vos fleurs dans un endroit frais, sec et à l\'abri de la lumière. Un contenant hermétique (bocal en verre) est idéal pour préserver les arômes et la fraîcheur. Évitez les variations de température et l\'humidité excessive.'
      },
      {
        q: 'D\'où viennent vos produits ?',
        a: 'Nos fleurs sont sélectionnées auprès de producteurs européens rigoureux, principalement en Suisse, en Italie et en France. Chaque lot fait l\'objet d\'une analyse en laboratoire pour garantir la conformité aux normes en vigueur.'
      },
    ]
  },
  {
    title: 'Commande & livraison',
    items: [
      {
        q: 'Comment passer une commande ?',
        a: 'Créez un compte sur notre site, ajoutez vos produits au panier et validez votre commande. Un email de confirmation vous sera envoyé automatiquement. Le paiement en ligne sera disponible très prochainement.'
      },
      {
        q: 'Quels sont les délais de livraison ?',
        a: 'Nous expédions les commandes sous 24 à 48h ouvrées. Le délai de livraison est ensuite de 2 à 5 jours ouvrés selon le transporteur et votre localisation.'
      },
      {
        q: 'Comment suivre ma commande ?',
        a: 'Une fois votre commande expédiée, vous recevrez un email avec votre numéro de suivi. Vous pouvez également retrouver ce numéro dans votre espace compte, à la rubrique "Mes commandes".'
      },
    ]
  },
  {
    title: 'Effets & usage',
    items: [
      {
        q: 'Quels sont les effets du CBD ?',
        a: 'Le CBD (cannabidiol) est un composé non psychoactif du chanvre. Il est reconnu pour ses propriétés relaxantes et apaisantes. Il ne provoque pas d\'euphorie ni d\'altération de la conscience, contrairement au THC.'
      },
      {
        q: 'Le CBD est-il addictif ?',
        a: 'Non. L\'Organisation mondiale de la santé (OMS) a conclu que le CBD ne présente pas de potentiel de dépendance et n\'est pas associé à des effets indésirables de santé publique.'
      },
      {
        q: 'À qui s\'adressent vos produits ?',
        a: 'Nos produits sont exclusivement réservés aux personnes majeures (18 ans et plus). Ils ne constituent pas un médicament et ne peuvent en aucun cas se substituer à un traitement médical. En cas de doute, consultez un professionnel de santé.'
      },
    ]
  },
]
</script>

<style scoped>
.faq-page {
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

.faq-section {
  padding: 72px 24px 100px;
  max-width: 800px;
}

.faq-group {
  margin-bottom: 56px;
}

.faq-group__title {
  font-size: var(--fs-tiny);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.faq-list {
  display: flex;
  flex-direction: column;
}

.faq-item {
  border-bottom: 1px solid var(--color-border);
}

.faq-question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 20px 0;
  background: none;
  border: none;
  text-align: left;
  font-family: var(--font-body);
  font-size: var(--fs-body);
  color: var(--color-text);
  cursor: pointer;
  transition: color var(--transition);
}

.faq-question:hover {
  color: var(--gold);
}

.faq-item.open .faq-question {
  color: var(--gold);
}

.faq-chevron {
  flex-shrink: 0;
  color: var(--color-text-subtle);
  transition: transform 0.25s ease;
}

.faq-item.open .faq-chevron {
  transform: rotate(180deg);
  color: var(--gold);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.faq-item.open .faq-answer {
  max-height: 300px;
}

.faq-answer p {
  padding: 0 0 20px;
  font-size: var(--fs-body);
  color: var(--color-text-muted);
  line-height: 1.8;
}

.faq-cta {
  margin-top: 16px;
  padding: 40px;
  background: var(--color-surface);
  border-left: 3px solid var(--gold);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  transition: background var(--transition);
}

.faq-cta__text {
  font-size: var(--fs-body);
  color: var(--color-text-muted);
}

.faq-cta__btn {
  font-size: var(--fs-xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold);
  white-space: nowrap;
  transition: opacity var(--transition);
}

.faq-cta__btn:hover {
  opacity: 0.7;
}

@media (max-width: 600px) {
  .faq-cta {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px;
  }
}
</style>
