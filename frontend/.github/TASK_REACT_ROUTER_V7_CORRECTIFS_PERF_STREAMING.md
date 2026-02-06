# Tâche Codex – Correctifs Performance & Streaming React Router v7

## Contexte
Cette tâche s’exécute **APRÈS** :
- `task_react_router_v7_audit_perf_streaming.md`

L’application utilise :
- React Router v7.x Data Router
- Loaders / Actions
- React 18+ (concurrent rendering)
- Possiblement Suspense / Await / defer

Les problèmes de performance ont déjà été identifiés et priorisés.

---

## Objectif
Appliquer des **correctifs ciblés** afin de :
- réduire le time-to-first-render
- améliorer la perception utilisateur lors des navigations
- exploiter efficacement le streaming (`defer`)
- supprimer les blocages inutiles sans modifier le comportement fonctionnel

Aucune nouvelle feature n’est attendue.

---

## Principes directeurs

- Optimiser **sans complexifier**
- Streamer uniquement ce qui est **réellement différable**
- Préserver la lisibilité du Data Router
- Ne jamais sacrifier la cohérence pour un micro-gain

---

## Types de correctifs autorisés

### 1. Loaders – parallélisation
- Remplacer les `await` en cascade par :
  - `Promise.all`
- Séparer clairement :
  - données critiques
  - données secondaires
- Réduire la charge des loaders parents

---

### 2. Streaming avec `defer`
- Introduire `defer` uniquement pour :
  - données non critiques
  - listes secondaires
  - widgets non bloquants
- Ne jamais defer :
  - données structurantes de page
  - permissions
  - décisions de rendu majeures

---

### 3. Suspense & Await
- Réduire la taille des boundaries Suspense
- Introduire plusieurs Suspense ciblés
- Fournir des fallbacks explicites et légers
- Éviter les Suspense globaux de layout

---

### 4. Navigation feedback
- Introduire ou affiner :
  - `useNavigation().state`
  - indicateurs visuels discrets
- Éviter les chargements silencieux
- Ne pas multiplier les loaders de transition

---

### 5. Code splitting
- Introduire `lazy()` sur :
  - routes lourdes
  - sections rarement visitées
- Éviter le lazy inutile pour routes critiques
- Respecter la hiérarchie de navigation

---

### 6. Revalidation
- Remplacer les revalidations globales par :
  - fetchers ciblés
  - `useRevalidator()` contrôlé
- Supprimer les refresh automatiques superflus

---

## Règles strictes

- ❌ Pas de changement fonctionnel
- ❌ Pas de modification d’API backend
- ❌ Pas d’optimisation prématurée
- ❌ Pas de streaming sans fallback clair
- ❌ Pa
