# Tâche Codex – Migration React Router v6 → v7

## Contexte
Le projet utilise actuellement **React Router v6.x** (ou inférieur) avec :
- routage JSX (`<Routes>`, `<Route>`)
- hooks legacy (`useNavigate`, `useLocation`, `useParams`)
- data fetching dans les composants
- gestion d’erreurs partielle ou globale
- absence de loaders / actions centralisés

React Router v7 introduit un **changement de paradigme majeur** vers le
**Data Router pattern**.

Cette tâche couvre une **migration contrôlée**, incrémentale et sécurisée.

---

## Objectif
Migrer l’application vers **React Router v7.x** en :
- conservant le comportement fonctionnel existant
- supprimant les APIs obsolètes
- adoptant progressivement loaders, actions et error boundaries
- préparant l’architecture pour streaming, SSR et React 19

Aucune fonctionnalité nouvelle ne doit être introduite.

---

## Portée de la migration

### APIs à supprimer ou transformer
- `<Switch>` → ❌
- `<Routes>` / `<Route>` → ❌
- `useHistory` → ❌
- `withRouter` → ❌
- data fetching dans `useEffect` → ❌

---

## Étapes de migration

### Étape 1 – Audit v6
Identifier :
- routes JSX existantes
- logique de chargement de données
- mutations (forms, submit handlers)
- erreurs gérées côté composant
- dépendances implicites entre routes

---

### Étape 2 – Migration du router
- Introduire `createBrowserRouter`
- Convertir les routes JSX en **configuration objet**
- Centraliser le router dans un point unique
- Ajouter des `id` de routes si partage de données

---

### Étape 3 – Migration des données
- Déplacer les `fetch` vers des `loader`
- Supprimer les `useEffect` de synchronisation serveur
- Identifier :
  - données critiques
  - données secondaires
- Maintenir un rendu équivalent

---

### Étape 4 – Migration des mutations
- Convertir les handlers en `action`
- Remplacer les `<form>` classiques par `<Form>`
- Supprimer les `setState` miroir du serveur
- Utiliser `redirect` et revalidation automatique

---

### Étape 5 – Gestion des erreurs
- Introduire des `errorElement`
- Remplacer les erreurs UI par `throw Response`
- Supprimer les try/catch JSX
- Segmenter les erreurs par route

---

### Étape 6 – Navigation
- Conserver `useNavigate` uniquement si nécessaire
- Introduire `href()` pour la génération d’URL
- Supprimer toute manipulation manuelle d’historique

---

## Rè
