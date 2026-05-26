<template>
  <div class="auth-page">

    <div class="page-hero">
      <p class="page-hero__eyebrow">OMEGACBD</p>
      <h1 class="page-hero__title">{{ isLogin ? 'Mon Compte' : 'Créer un compte' }}</h1>
      <div class="page-hero__divider"></div>
      <p class="page-hero__sub">{{ isLogin ? 'Accédez à votre espace personnel' : 'Rejoignez OMEGACBD' }}</p>
    </div>

    <div class="auth-section container">
      <div class="auth-card">

        <div class="auth-tabs">
          <button class="auth-tab" :class="{ active: isLogin }" @click="isLogin = true">Connexion</button>
          <button class="auth-tab" :class="{ active: !isLogin }" @click="isLogin = false">Inscription</button>
        </div>

        <form class="auth-form" @submit.prevent="handleSubmit">

          <div v-if="!isLogin" class="form-row">
            <div class="form-group">
              <label class="form-label">Prénom</label>
              <input v-model="firstName" type="text" class="form-input" placeholder="Jean" required />
            </div>
            <div class="form-group">
              <label class="form-label">Nom</label>
              <input v-model="lastName" type="text" class="form-input" placeholder="Dupont" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Email</label>
            <input v-model="email" type="email" class="form-input" placeholder="votre@email.com" required />
          </div>

          <div class="form-group">
            <label class="form-label">Mot de passe</label>
            <input v-model="password" type="password" class="form-input" placeholder="••••••••" required minlength="8" />
            <p v-if="!isLogin" class="form-hint">8 caractères minimum</p>
          </div>

          <div v-if="!isLogin" class="form-group">
            <label class="form-label">Date de naissance</label>
            <input v-model="birthdate" type="date" class="form-input" required />
            <p class="form-hint">Réservé aux personnes majeures (18 ans et plus)</p>
          </div>

          <div v-if="isLogin" class="form-remember">
            <label class="remember-label">
              <input v-model="rememberMe" type="checkbox" class="remember-checkbox" />
              Rester connecté 30 jours
            </label>
          </div>

          <div v-if="error" class="auth-error">{{ error }}</div>
          <div v-if="success" class="auth-success">
            {{ success }}
            <p v-if="!isLogin" class="resend-line">
              Email non reçu ?
              <button class="resend-btn" :disabled="resendCooldown > 0" @click.prevent="handleResend">
                {{ resendCooldown > 0 ? `Renvoyer (${resendCooldown}s)` : 'Renvoyer l\'email' }}
              </button>
            </p>
          </div>

          <button type="submit" class="auth-submit" :disabled="loading || lockoutTimer > 0">
            {{ lockoutTimer > 0 ? `Réessayer dans ${lockoutTimer}s` : loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'Créer mon compte') }}
          </button>

          <p v-if="isLogin" class="auth-forgot" @click="handleReset">Mot de passe oublié ?</p>

        </form>

        <div v-if="!isLogin" class="auth-legal">
          <p>En vous inscrivant, vous confirmez avoir 18 ans ou plus et acceptez nos <NuxtLink to="/infos#cgv">CGV</NuxtLink> et notre <NuxtLink to="/infos#confidentialite">politique de confidentialité</NuxtLink>.</p>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const router = useRouter()

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const firstName = ref('')
const lastName = ref('')
const birthdate = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

watch(isLogin, () => {
  error.value = ''
  success.value = ''
})

const isAdult = (date) => {
  const birth = new Date(date)
  const today = new Date()
  const age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  return age > 18 || (age === 18 && m >= 0 && today.getDate() >= birth.getDate())
}

const handleSubmit = async () => {
  if (lockoutTimer.value > 0) return
  error.value = ''
  success.value = ''
  loading.value = true

  if (!isLogin.value && !isAdult(birthdate.value)) {
    error.value = 'Vous devez avoir 18 ans ou plus pour créer un compte.'
    loading.value = false
    return
  }

  if (isLogin.value) {
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
    if (err) {
      loginAttempts.value++
      if (loginAttempts.value >= 5) {
        error.value = `Trop de tentatives. Réessayez dans 60 secondes.`
        startLockout()
      } else {
        error.value = `Email ou mot de passe incorrect. (${loginAttempts.value}/5)`
      }
      loading.value = false
      return
    }
    loginAttempts.value = 0
    if (rememberMe.value) {
      localStorage.setItem('rememberMe', 'true')
      localStorage.setItem('loginDate', Date.now().toString())
    } else {
      localStorage.removeItem('rememberMe')
      localStorage.removeItem('loginDate')
    }
    router.push('/compte/dashboard')
  } else {
    const { error: err } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: { data: { first_name: firstName.value, last_name: lastName.value, birthdate: birthdate.value } }
    })
    if (err) {
      if (err.message.includes('already registered') || err.message.includes('already been registered')) {
        error.value = 'Un compte existe déjà avec cet email.'
      } else {
        error.value = err.message
      }
      loading.value = false; return
    }
    success.value = 'Compte créé ! Vérifiez votre email pour confirmer votre inscription.'
  }

  loading.value = false
}

const loginAttempts = ref(0)
const lockoutTimer = ref(0)
let lockoutInterval = null

const startLockout = () => {
  lockoutTimer.value = 60
  lockoutInterval = setInterval(() => {
    lockoutTimer.value--
    if (lockoutTimer.value <= 0) {
      clearInterval(lockoutInterval)
      loginAttempts.value = 0
    }
  }, 1000)
}

const resendCooldown = ref(0)

const handleResend = async () => {
  const { error: err } = await supabase.auth.resend({ type: 'signup', email: email.value })
  if (err) { error.value = err.message; return }
  success.value = 'Email renvoyé ! Vérifiez votre boîte mail.'
  resendCooldown.value = 60
  const interval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) clearInterval(interval)
  }, 1000)
}

const handleReset = async () => {
  if (!email.value) { error.value = 'Entrez votre email ci-dessus.'; return }
  const { error: err } = await supabase.auth.resetPasswordForEmail(email.value)
  if (err) { error.value = err.message; return }
  success.value = 'Email de réinitialisation envoyé.'
}
</script>

<style scoped>
.auth-page {
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

.auth-section {
  padding: 60px 24px 100px;
  max-width: 520px;
}

.auth-card {
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  transition: background var(--transition);
}

.auth-tabs {
  display: flex;
  border-bottom: 1px solid var(--color-border);
}

.auth-tab {
  flex: 1;
  padding: 16px;
  font-size: var(--fs-label);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  background: none;
  border: none;
  cursor: pointer;
  transition: color var(--transition), background var(--transition);
}

.auth-tab.active {
  color: var(--color-text);
  border-bottom: 2px solid var(--gold);
}

.auth-form {
  padding: 36px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: var(--fs-tiny);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.form-input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: var(--fs-body);
  outline: none;
  transition: border-color var(--transition), background var(--transition);
}

.form-input:focus {
  border-color: var(--gold);
}

.form-hint {
  font-size: var(--fs-label);
  color: var(--color-text-subtle);
}

.auth-error {
  padding: 12px 16px;
  background: #fff0f0;
  border-left: 3px solid #e53e3e;
  font-size: var(--fs-small);
  color: #c53030;
}

.auth-success {
  padding: 12px 16px;
  background: #f0fff4;
  border-left: 3px solid var(--gold);
  font-size: var(--fs-small);
  color: var(--color-text-muted);
}

.auth-submit {
  padding: 14px;
  background: var(--color-text);
  color: var(--color-bg);
  font-family: var(--font-body);
  font-size: var(--fs-label);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  border: none;
  transition: background var(--transition);
}

.auth-submit:hover:not(:disabled) {
  background: var(--gold);
  color: var(--white);
}

.auth-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-remember {
  display: flex;
  align-items: center;
}

.remember-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--fs-label);
  color: var(--color-text-muted);
  cursor: pointer;
}

.remember-checkbox {
  width: 16px;
  height: 16px;
  accent-color: var(--gold);
  cursor: pointer;
}

.auth-forgot {
  text-align: center;
  font-size: var(--fs-xs);
  color: var(--color-text-subtle);
  cursor: pointer;
  text-decoration: underline;
}

.auth-forgot:hover {
  color: var(--gold);
}

.resend-line {
  margin-top: 8px;
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
}

.resend-btn {
  background: none;
  border: none;
  font-size: var(--fs-xs);
  color: var(--gold);
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}

.resend-btn:disabled {
  color: var(--color-text-subtle);
  cursor: not-allowed;
  text-decoration: none;
}

.auth-legal {
  padding: 20px 36px;
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
  transition: background var(--transition);
}

.auth-legal p {
  font-size: var(--fs-label);
  color: var(--color-text-subtle);
  line-height: 1.7;
}

.auth-legal a {
  color: var(--gold);
  text-decoration: underline;
}
</style>
