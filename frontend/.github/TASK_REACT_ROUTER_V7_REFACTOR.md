# Tâche Codex – Refactorisation React Router v7

## Contexte
Cette tâche concerne un projet React existant utilisant **React Router v7.x**, ou en cours de migration depuis v6/v5.

Le projet peut présenter :
- logique de navigation dispersée
- data fetching dans les composants
- loaders/actions incohérents ou dupliqués
- erreurs mal gérées
- routes définies en JSX legacy

Le contexte React Router v7 fourni est **référence absolue**.

---

## Objectif
Refactoriser le routage et la gestion des données afin de :
- respecter strictement le **Data Router pattern**
- améliorer la lisibilité et la maintenabilité
- supprimer toute logique obsolète ou redondante
- préparer le code pour React 19 / SSR / streaming

Aucune nouvelle fonctionnalité n’est attendue.  
Refactorisation **structurelle et conceptuelle uniquement**.

---

## Axes de refactorisation

### 1. Architecture de routes
- Remplacer les routes JSX (`<Routes>`, `<Route>`) par :
  - `createBrowserRouter`
  - configuration objet
- Introduire des `id` de routes lorsque le partage de données est nécessaire
- Centraliser la définition du router

### 2. Chargement de données
- Supprimer tout `fetch` ou appel API dans :
  - `useEffect`
  - handlers d’événements
- Déplacer la logique vers :
  - `loader`
  - `defer` si pertinent
- Mutualiser les loaders redondants

### 3. Mutations
- Remplacer toute mutation manuelle par :
  - `action`
  - `Form` / `fetcher.Form`
- Supprimer les états locaux servant uniquement à refléter l’état serveur
- Introduire `redirect` ou revalidation automatique

### 4. Gestion des erreurs
- Introduire des `errorElement` par route critique
- Remplacer les try/catch UI par :
  - `throw new Response`
  - gestion centralisée
- Clarifier les erreurs métier vs techniques

### 5. Navigation
- Remplacer :
  - `useHistory`
  - `navigate` excessif
- Prioriser :
  - `<Link>`
  - `href()` pour génération d’URL
- Supprimer toute manipulation manuelle de l’historique

---

## Règles strictes

- ❌ Pas de data fetching dans les composants
- ❌ Pas de logique métier dans le JSX
- ❌ Pas de duplication loader/action
- ❌ Pas de dépendance implicite entre routes
- ❌ Pas de `useEffect` pour synchroniser serveur → UI

---

## Étapes attendues

### Étape 1 – Audit
- Identifier :
  - routes legacy
  - effets redondants
  - loaders/actions manquants ou mal placés
  - composants trop responsables

### Étape 2 – Redesign
- Redéfinir la hiérarchie des routes
- Déterminer clairement :
  - loaders parents / enfants
  - actions associées
  - données partagées

### Étape 3 – Implémentation
- Refactoriser sans changer le comportement fonctionnel
- Améliorer la lisibilité et la cohérence
- Extraire les loaders/actions si nécessaire

### Étape 4 – Nettoyage
- Supprimer le code mort
- Supprimer les hooks inutiles
- Harmoniser la gestion des erreurs

---

## Périmètre technique autorisé

- `useLoaderData`
- `useActionData`
- `useNavigation`
- `useFetcher`
- `useRouteLoaderData`
- `useRevalidator`
- `lazy()` si opportun
- `middleware` uniquement si déjà présent ou nécessaire

---

## Sortie attendue

### Code
- Fichiers modifiés clairement identifiés
- Avant / après implicite par le diff
- Code TypeScript propre et cohérent

### Texte
- Résumé concis des changements
- Justification des décisions structurantes
- Pas de tutoriel
- Pas de reformulation des règles

---

## Critères de réussite

- Routage lisible et prévisible
- Data chargée avant rendu
- Mutations centralisées
- Erreurs isolées par route
- Base saine pour évolutions futures

---

## En cas d’ambiguïté
**STOP.**  
Demander clarification avant refactorisation.
