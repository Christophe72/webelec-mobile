# Tâche Codex – Alignement React Router v7 avec Next.js App Router

## Contexte
Le projet utilise **React Router v7** dans un contexte :
- mono-repo
- migration vers Next.js
- coexistence React SPA / Next.js App Router
- ou comparaison architecturale

React Router v7 et **Next.js App Router** partagent désormais :
- data loading avant rendu
- streaming
- mutations server-driven
- error boundaries par segment
- hiérarchie de routes explicite

Mais leurs responsabilités diffèrent.

---

## Objectif
Aligner l’architecture React Router v7 pour :
- réduire l’écart conceptuel avec Next.js App Router
- faciliter une migration future ou une cohabitation
- éviter les patterns incompatibles ou non transférables

Sans réécrire l’application en Next.js.

---

## Axes d’alignement

### 1. Architecture de routes
- Approcher une structure équivalente à :
  - `layout.tsx` → routes parentes
  - `page.tsx` → routes feuilles
- Éviter les routes plates
- Structurer clairement les layouts persistants

---

### 2. Chargement de données
- Loaders comme équivalent de :
  - `fetch()` côté serveur
- Séparer :
  - données globales (layout)
  - données locales (page)
- Éviter les loaders trop lourds ou transversaux

---

### 3. Mutations
- Actions comme équivalent de :
  - Server Actions
- Centraliser la logique métier serveur
- Supprimer toute mutation purement client
- Préparer une transition vers actions server-only

---

### 4. Streaming & performance
- Identifier les loaders candidats à `defer`
- Préparer le découpage critique / non critique
- Éviter les waterfalls
- Structurer pour Suspense-compatible rendering

---

### 5. Erreurs
- Aligner :
  - `errorElement` ↔ `error.tsx`
  - erreurs par segment
- Supprimer les erreurs globales catch-all
- Favoriser des erreurs locales et contextuelles

---

### 6. Conventions de navigation
- URLs stables, explicites
- Pas de navigation dynamique opaque
- Utilisation systématique de `href()`

---

## Ce qu’il ne faut PAS faire

- ❌ Simuler Next.js dans React Router
- ❌ Introduire du SSR artificiel
- ❌ Copier des patterns App Router non applicables
- ❌ Coupler React Router à Next.js runtime

---

## Sortie attendue

### Code
- Routage structuré et hiérarchisé
- Loaders/actions alignés conceptuellement
- Aucun changement fonctionnel visible

### Texte
- Tableau de correspondance React Router v7 ↔ Next.js App Router
- Décisions architecturales
- Points de divergence assumés

---

## Critère de réussite
Un développeur connaissant Next.js App Router doit pouvoir :
- lire le projet
- comprendre la structure immédiatement
- envisager une migration sans refonte complète
