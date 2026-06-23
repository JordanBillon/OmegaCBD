<template>
  <header class="navbar" :class="{ 'navbar--scrolled': isScrolled }">
    <div class="navbar__inner container">

      <NuxtLink to="/" class="navbar__logo">
        <img src="/logo.png" alt="OMEGACBD" />
      </NuxtLink>

      <nav class="navbar__nav">
        <NuxtLink to="/" class="nav-link" active-class="nav-link--active" exact>Accueil</NuxtLink>

        <div class="nav-dropdown" @mouseenter="productsOpen = true" @mouseleave="productsOpen = false">
          <span class="nav-link" :class="{ 'nav-link--active': isProductsRoute }">
            Nos Produits
            <svg class="chevron" :class="{ open: productsOpen }" width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </span>
          <div class="dropdown-menu" :class="{ open: productsOpen }">
            <NuxtLink to="/produits/cbd" class="dropdown-item" @click="productsOpen = false">
              Collection CBD
            </NuxtLink>
            <NuxtLink to="/produits/thx" class="dropdown-item" @click="productsOpen = false">
              Collection THX
            </NuxtLink>
          </div>
        </div>

        <NuxtLink to="/infos" class="nav-link" active-class="nav-link--active">Infos</NuxtLink>
        <NuxtLink to="/faq" class="nav-link" active-class="nav-link--active">FAQ</NuxtLink>
        <NuxtLink to="/blog" class="nav-link" active-class="nav-link--active">Blog</NuxtLink>
        <NuxtLink to="/contact" class="nav-link" active-class="nav-link--active">Contact</NuxtLink>
      </nav>

      <div class="navbar__actions">
        <NuxtLink to="/compte" class="action-link" :aria-label="isLoggedIn ? 'Mon Compte' : 'Se connecter'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span class="action-label">{{ isLoggedIn ? 'Mon Compte' : 'Se connecter' }}</span>
        </NuxtLink>

        <NuxtLink to="/panier" class="action-link cart-link" :aria-label="count > 0 ? `Panier, ${count} article${count > 1 ? 's' : ''}` : 'Mon panier'">
          <span class="cart-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span v-if="count > 0" class="cart-badge">{{ count > 9 ? '9+' : count }}</span>
          </span>
          <span class="action-label">Panier</span>
        </NuxtLink>

        <button class="theme-toggle" @click="toggle" :aria-label="isDark ? 'Mode clair' : 'Mode sombre'">
          <svg v-if="isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>

        <button class="burger" @click="mobileOpen = !mobileOpen" aria-label="Menu">
          <span :class="{ open: mobileOpen }"></span>
          <span :class="{ open: mobileOpen }"></span>
          <span :class="{ open: mobileOpen }"></span>
        </button>
      </div>
    </div>

    <div class="mobile-menu" :class="{ open: mobileOpen }">
      <NuxtLink to="/" class="mobile-link" @click="mobileOpen = false">Accueil</NuxtLink>
      <div class="mobile-section">
        <span class="mobile-section-title">Nos Produits</span>
        <NuxtLink to="/produits/cbd" class="mobile-link mobile-link--sub" @click="mobileOpen = false">Collection CBD</NuxtLink>
        <NuxtLink to="/produits/thx" class="mobile-link mobile-link--sub" @click="mobileOpen = false">Collection THX</NuxtLink>
      </div>
      <NuxtLink to="/infos" class="mobile-link" @click="mobileOpen = false">Infos</NuxtLink>
      <NuxtLink to="/faq" class="mobile-link" @click="mobileOpen = false">FAQ</NuxtLink>
      <NuxtLink to="/blog" class="mobile-link" @click="mobileOpen = false">Blog</NuxtLink>
      <NuxtLink to="/contact" class="mobile-link" @click="mobileOpen = false">Contact</NuxtLink>
      <div class="mobile-actions">
        <NuxtLink to="/compte" class="mobile-link" @click="mobileOpen = false">{{ isLoggedIn ? 'Mon Compte' : 'Se connecter' }}</NuxtLink>
        <NuxtLink to="/panier" class="mobile-link" @click="mobileOpen = false">Mon Panier</NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()
const isScrolled = ref(false)
const productsOpen = ref(false)
const mobileOpen = ref(false)
const { isDark, toggle } = useTheme()
const isLoggedIn = ref(false)
const { count, load, clear } = useCart()
onMounted(load)

const isProductsRoute = computed(() => route.path.startsWith('/produits'))

onMounted(async () => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 20
  })
  const { data: { user } } = await supabase.auth.getUser()
  isLoggedIn.value = !!user
  if (!user) clear()

  supabase.auth.onAuthStateChange((event, session) => {
    isLoggedIn.value = !!session
    if (event === 'SIGNED_OUT') clear()
  })
})

const logout = async () => {
  await supabase.auth.signOut()
  isLoggedIn.value = false
  router.push('/')
}

watch(() => route.path, () => {
  mobileOpen.value = false
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--color-bg);
  border-bottom: 1px solid transparent;
  transition: border-color var(--transition), box-shadow var(--transition), background var(--transition);
}

.navbar--scrolled {
  border-color: var(--color-border);
  box-shadow: 0 2px 20px rgba(0,0,0,0.06);
}

.navbar__inner {
  display: flex;
  align-items: center;
  height: var(--navbar-height);
  gap: 40px;
}

.navbar__logo img {
  height: 118px;
  width: 118px;
  object-fit: contain;
}

.navbar__nav {
  display: flex;
  align-items: center;
  gap: 32px;
  flex: 1;
  justify-content: center;
}

.nav-link {
  font-family: var(--font-body);
  font-size: var(--fs-small);
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  transition: color var(--transition);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link:hover,
.nav-link--active {
  color: var(--color-text);
}

.nav-link--active {
  border-bottom: 1px solid var(--gold);
  padding-bottom: 2px;
}

.chevron {
  transition: transform var(--transition);
}
.chevron.open {
  transform: rotate(180deg);
}

.nav-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding-top: 16px;
  background: transparent;
  min-width: 180px;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--transition);
}

.dropdown-menu::before {
  content: '';
  display: block;
  position: absolute;
  top: 16px;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  z-index: -1;
}

.dropdown-menu.open {
  opacity: 1;
  pointer-events: auto;
}

.dropdown-item {
  display: block;
  padding: 12px 20px;
  font-size: var(--fs-xs);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  transition: color var(--transition), background var(--transition);
}

.dropdown-item:hover {
  color: var(--color-text);
  background: var(--color-surface);
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.action-link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--fs-xs);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  transition: color var(--transition);
}

.action-link:hover {
  color: var(--color-text);
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--color-text-muted);
  transition: color var(--transition);
  border-radius: 50%;
}

.theme-toggle:hover {
  color: var(--color-text);
}

.cart-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.cart-badge {
  position: absolute;
  top: -7px;
  right: -7px;
  background: var(--gold);
  color: var(--white);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  line-height: 1;
}

.action-label {
  display: none;
}

@media (min-width: 1100px) {
  .action-label {
    display: inline;
  }
}

.burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 4px;
  width: 28px;
}

.burger span {
  display: block;
  height: 1.5px;
  background: var(--color-text);
  transition: transform var(--transition), opacity var(--transition);
  transform-origin: center;
}

.burger span.open:nth-child(1) {
  transform: translateY(6.5px) rotate(45deg);
}
.burger span.open:nth-child(2) {
  opacity: 0;
}
.burger span.open:nth-child(3) {
  transform: translateY(-6.5px) rotate(-45deg);
}

.mobile-menu {
  display: none;
  flex-direction: column;
  background: var(--color-bg);
  border-top: 1px solid var(--color-border);
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease;
}

.mobile-menu.open {
  max-height: 500px;
}

.mobile-link {
  display: block;
  padding: 14px 24px;
  font-size: var(--fs-small);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-surface);
  transition: color var(--transition);
}

.mobile-link:hover {
  color: var(--color-text);
}

.mobile-link--sub {
  padding-left: 40px;
  font-size: var(--fs-xs);
}

.mobile-section-title {
  display: block;
  padding: 14px 24px 4px;
  font-size: var(--fs-label);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-subtle);
}

.mobile-actions {
  border-top: 1px solid var(--color-border);
  margin-top: 8px;
}

@media (max-width: 900px) {
  .navbar__nav {
    display: none;
  }

  .navbar__actions {
    margin-left: auto;
  }

  .burger {
    display: flex;
  }

  .mobile-menu {
    display: flex;
  }

  .action-link .action-label {
    display: none;
  }
}

@media (max-width: 400px) {
  .navbar__inner {
    gap: 8px;
  }

  .navbar__logo img {
    height: 80px;
    width: 80px;
  }

  .navbar__actions {
    gap: 12px;
  }
}
</style>
