export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase'],
  routeRules: {
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://papfkhgynxgunizpkbqk.supabase.co wss://papfkhgynxgunizpkbqk.supabase.co;"
      }
    }
  },
  supabase: {
    redirectOptions: {
      login: '/compte/connexion',
      callback: '/compte/confirm',
      exclude: ['/', '/produits/*', '/infos', '/contact'],
    }
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'OMEGACBD — CBD Premium',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'OMEGACBD — Fleurs de CBD premium sélectionnées avec soin pour une expérience d\'exception. Qualité garantie, taux THC < 0.3%.' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,600&display=swap' }
      ]
    }
  }
})
