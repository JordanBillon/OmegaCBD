<template>
  <div class="contact-page">

    <div class="page-hero">
      <p class="page-hero__eyebrow">OMEGACBD</p>
      <h1 class="page-hero__title">Contactez-nous</h1>
      <div class="page-hero__divider"></div>
      <p class="page-hero__sub">Une question, une commande ? Nous vous répondons sous 24h.</p>
    </div>

    <div class="contact-section container">
      <div class="contact-grid">

        <div class="contact-info">
          <h2 class="contact-info__title">Informations</h2>

          <div class="info-blocks">

            <div class="info-block">
              <div class="info-block__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <p class="info-block__label">Email</p>
                <p class="info-block__value">contact@omegacbd.fr</p>
              </div>
            </div>

            <div class="info-block">
              <div class="info-block__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.47 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
                </svg>
              </div>
              <div>
                <p class="info-block__label">Téléphone</p>
                <p class="info-block__value">Sur demande par email</p>
              </div>
            </div>

            <div class="info-block">
              <div class="info-block__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <p class="info-block__label">Horaires</p>
                <p class="info-block__value">Lundi – Vendredi<br>9h00 – 18h00</p>
              </div>
            </div>

            <div class="info-block">
              <div class="info-block__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <p class="info-block__label">Entreprise</p>
                <p class="info-block__value">OMEGACBD<br>France</p>
              </div>
            </div>

          </div>

          <div class="contact-legal">
            <p>Conformément à la loi française, nos produits ne sont vendus qu'aux personnes majeures (18 ans et plus). Taux THC &lt; 0.3%.</p>
          </div>
        </div>

        <div class="contact-form-wrap">
          <h2 class="contact-form-wrap__title">Envoyer un message</h2>
          <form class="contact-form" @submit.prevent="handleSubmit">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="nom">Nom *</label>
                <input id="nom" v-model="form.nom" type="text" class="form-input" placeholder="Votre nom" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="prenom">Prénom *</label>
                <input id="prenom" v-model="form.prenom" type="text" class="form-input" placeholder="Votre prénom" required />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="email">Email *</label>
              <input id="email" v-model="form.email" type="email" class="form-input" placeholder="votre@email.com" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="sujet">Sujet</label>
              <select id="sujet" v-model="form.sujet" class="form-input form-select">
                <option value="">Choisir un sujet</option>
                <option value="commande">Passer une commande</option>
                <option value="info">Informations produits</option>
                <option value="partenariat">Partenariat / B2B</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="message">Message *</label>
              <textarea id="message" v-model="form.message" class="form-input form-textarea" placeholder="Votre message..." rows="5" required></textarea>
            </div>
            <div class="form-group form-group--checkbox">
              <input id="age" v-model="form.age" type="checkbox" required />
              <label for="age" class="form-label-checkbox">Je certifie avoir 18 ans ou plus et accepte la <NuxtLink to="/infos#confidentialite">politique de confidentialité</NuxtLink>.</label>
            </div>
            <input v-model="form.honeypot" type="text" name="website" tabindex="-1" autocomplete="off" class="honeypot" aria-hidden="true" />
            <div v-if="error" class="form-error">{{ error }}</div>
            <button type="submit" class="form-submit" :disabled="loading">
              {{ submitted ? 'Message envoyé ✓' : loading ? 'Envoi en cours...' : 'Envoyer le message' }}
            </button>
          </form>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
const form = reactive({
  nom: '',
  prenom: '',
  email: '',
  sujet: '',
  message: '',
  age: false,
  honeypot: ''
})

const submitted = ref(false)
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/contact', { method: 'POST', body: form })
    submitted.value = true
    Object.assign(form, { nom: '', prenom: '', email: '', sujet: '', message: '', age: false, honeypot: '' })
  } catch {
    error.value = 'Une erreur est survenue. Veuillez réessayer ou nous contacter par email.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.contact-page {
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
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  transition: color var(--transition);
}

.contact-section {
  padding: 80px 24px;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.8fr;
  gap: 64px;
  align-items: start;
}

.contact-info__title,
.contact-form-wrap__title {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 400;
  color: var(--color-text);
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--grey-200);
}

.info-block {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
}

.info-block__icon {
  color: var(--gold);
  flex-shrink: 0;
  margin-top: 2px;
}

.info-block__label {
  font-size: var(--fs-tiny);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--grey-400);
  margin-bottom: 4px;
}

.info-block__value {
  font-size: var(--fs-body);
  color: var(--color-text);
  line-height: 1.6;
}

.contact-legal {
  margin-top: 32px;
  padding: 16px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  transition: background var(--transition);
}

.contact-legal p {
  font-size: var(--fs-label);
  color: var(--color-text-muted);
  line-height: 1.7;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: var(--fs-tiny);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--grey-200);
  background: var(--white);
  font-family: var(--font-body);
  font-size: var(--fs-body);
  color: var(--color-text);
  transition: border-color var(--transition);
  outline: none;
  appearance: none;
}

.form-input:focus {
  border-color: var(--gold);
}

.form-select {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23aaa' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-group--checkbox {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.form-group--checkbox input {
  margin-top: 3px;
  flex-shrink: 0;
  accent-color: var(--gold);
}

.form-label-checkbox {
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
  line-height: 1.6;
}

.form-label-checkbox a {
  color: var(--gold);
  text-decoration: underline;
}

.form-submit {
  width: 100%;
  padding: 15px;
  background: var(--color-text);
  color: var(--white);
  font-family: var(--font-body);
  font-size: var(--fs-label);
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background var(--transition);
  border: none;
  margin-top: 8px;
}

.form-submit:hover:not(:disabled) {
  background: var(--gold);
}

.form-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.honeypot {
  position: absolute;
  left: -9999px;
  opacity: 0;
  height: 0;
  width: 0;
}

.form-error {
  padding: 12px 16px;
  background: #fff0f0;
  border-left: 3px solid #e53e3e;
  font-size: var(--fs-small);
  color: #c53030;
  margin-bottom: 8px;
}

@media (max-width: 900px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  /* Section informations — grille 2x2 */
  .contact-info {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .contact-info__title {
    text-align: center;
    width: 100%;
  }

  .contact-info .info-blocks {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--color-border);
    width: 100%;
  }

  .info-block {
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 0;
    background: var(--color-bg);
    padding: 24px 16px;
  }

  .info-block__icon {
    margin-top: 0;
  }

  .contact-legal {
    text-align: center;
  }

  /* Formulaire — centré, inputs réduits */
  .contact-form-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .contact-form-wrap__title {
    width: 100%;
    max-width: 460px;
    text-align: center;
  }

  .contact-form {
    width: 100%;
    max-width: 460px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-group--checkbox {
    align-items: flex-start;
  }
}

@media (max-width: 400px) {
  .contact-info .info-blocks {
    grid-template-columns: 1fr;
  }
}
</style>
