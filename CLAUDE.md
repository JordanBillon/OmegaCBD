# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # Installe les dépendances
npm run dev        # Lance le serveur de développement (http://localhost:3000)
npm run build      # Build de production
npm run generate   # Génère le site en statique
npm run preview    # Prévisualise le build de production
```

> Après `npm install`, `nuxt prepare` est exécuté automatiquement (postinstall) — il génère le dossier `.nuxt/` et les types TypeScript auto-importés. Les erreurs TS sur `defineNuxtConfig`, `useRoute`, `ref`, etc. disparaissent après cette étape.

## Architecture

**Nuxt 4** avec le répertoire source `app/` (convention Nuxt 4 par défaut).

### Routing

Le routing est basé sur les fichiers dans `app/pages/` :
- `/` → `app/pages/index.vue`
- `/produits/jsh` → `app/pages/produits/jsh.vue`
- `/produits/thx` → `app/pages/produits/thx.vue`
- `/contact` → `app/pages/contact.vue`
- `/infos` → `app/pages/infos.vue`

### Layout

`app/layouts/default.vue` enveloppe toutes les pages via `app/app.vue` (`<NuxtLayout>` + `<NuxtPage>`). Il inclut `TheNavbar` et `TheFooter`.

### Styles

- **CSS global** : `app/assets/css/main.css` — contient toutes les variables CSS (couleurs, fonts, espacements) sous `:root`. À modifier en priorité pour changer l'identité visuelle.
- **Styles de composant** : `<style scoped>` dans chaque `.vue`. Pas de framework CSS externe.
- **Polices** : Cormorant Garamond (Google Fonts, titres) + Helvetica Now Text / Helvetica Neue (corps de texte, système).
- **Palette** : `--black` #0a0a0a, `--white` #fafafa, `--gold` #c9a96e, niveaux de gris via `--grey-100` à `--grey-800`.

### Images produits

Toutes dans `public/` (servies à la racine `/`) :
- `Amnesia_Indoor_ss-fond.webp` → Amnesia Haze JSH
- `Mango_Haze_ss-fond.webp` → Mango Haze Premium
- `Purple_Haze-ss-fond.webp` → Purple Haze Premium
- `Alien-OG-THX-1.webp` → Alien OG THX
- `Fleur-THX-1.webp` → Fantasy THX
- `euphoria-1.webp` → Euphoria THX
- `logo.webp` → Logo OMEGACBD

### Contexte projet

Site vitrine CBD destiné à convaincre des partenaires bancaires de la solidité du projet. Pas d'e-commerce fonctionnel pour l'instant — les boutons "Commander" redirigent vers `/contact`. Toutes les pages produits incluent un bloc légal obligatoire (décret n°2021-1247, THC < 0.3%).
