export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase', 'nuxt-security'],
  security: {
    headers: {
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'nonce-{{nonce}}'"],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'img-src': ["'self'", 'data:', 'blob:'],
        'connect-src': ["'self'", 'https://papfkhgynxgunizpkbqk.supabase.co', 'wss://papfkhgynxgunizpkbqk.supabase.co'],
      },
      xFrameOptions: 'DENY',
      xContentTypeOptions: 'nosniff',
      referrerPolicy: 'strict-origin-when-cross-origin',
      permissionsPolicy: { camera: [], microphone: [], geolocation: [] },
      strictTransportSecurity: { maxAge: 31536000, includeSubdomains: true }
    }
  },
  runtimeConfig: {
    resendApiKey: '',
    adminEmail: ''
  },
  supabase: {
    redirectOptions: {
      login: '/compte/connexion',
      callback: '/compte/confirm',
      exclude: ['/', '/produits/*', '/infos', '/faq', '/contact', '/blog', '/blog/*'],
    }
  },
css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'OMEGACBD — CBD Premium',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'OMEGACBD — Fleurs de CBD premium sélectionnées avec soin pour une expérience d\'exception. Qualité garantie, taux THC < 0.3%.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'OMEGACBD' },
        { property: 'og:title', content: 'OMEGACBD — CBD Premium' },
        { property: 'og:description', content: 'Fleurs de CBD premium sélectionnées avec soin pour une expérience d\'exception. Qualité garantie, taux THC < 0.3%.' },
        { property: 'og:image', content: 'https://omegacbd.fr/logo.png' },
        { property: 'og:url', content: 'https://omegacbd.fr' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'OMEGACBD — CBD Premium' },
        { name: 'twitter:description', content: 'Fleurs de CBD premium sélectionnées avec soin pour une expérience d\'exception. Qualité garantie, taux THC < 0.3%.' },
        { name: 'twitter:image', content: 'https://omegacbd.fr/logo.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,600&display=swap' }
      ]
    }
  }
})
