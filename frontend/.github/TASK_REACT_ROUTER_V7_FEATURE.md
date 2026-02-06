# Tâche Codex – Développement de fonctionnalité React Router v7

## Contexte
Cette tâche s’applique à un projet **React Router v7.x** utilisant :
- Data Router (`createBrowserRouter`, `RouterProvider`)
- Loaders / Actions
- Error Boundaries par route
- TypeScript (prioritaire)
- React 18+ (compatible React 19)

Le contexte React Router v7 fourni est **autoritaire**.

---

## Objectif
Implémenter une **fonctionnalité complète** basée sur le **Data Router pattern**, incluant si nécessaire :
- chargement de données
- mutations
- gestion d’erreurs
- navigation
- états de chargement

Le tout **sans effet de bord**, **sans bricolage JSX legacy**.

---

## Architecture obligatoire

### Routing
- Définition des routes via **configuration objet**
- Pas de `<Routes>` / `<Route>` JSX legacy
- `lazy()` utilisé si code-splitting pertinent

### Data
- Données chargées exclusivement via `loader`
- Mutations gérées via `action`
- Aucun `useEffect` pour fetcher des données de page

### UI
- `useLoaderData`, `useActionData`, `useNavigation`
- `Form` ou `fetcher.Form` pour mutations
- `fetcher` pour actions sans navigation

### Erreurs
- `errorElement` par route concernée
- Erreurs métier gérées explicitement
- Pas de try/catch silencieux dans les composants

---

## Périmètre technique autorisé

### Loaders
- Accès aux params
- Accès aux search params via `request.url`
- Chargement parallèle autorisé
- `defer` uniquement si bénéfice réel

### Actions
- Gestion de formulaires
- Redirections via `redirect`
- Retour d’erreurs sérialisables
- Revalidation automatique attendue

### Navigation
- `Link` et `href()` prioritaire
- `useNavigate()` uniquement si nécessaire
- Pas de manipulation manuelle de l’historique

### Avancé (si requis)
- `fetcher` pour optimistic UI
- `useRevalidator()` pour refresh contrôlé
- `useRouteLoaderData()` pour partage parent/enfant
- `middleware` si authentification / filtrage requis

---

## Règles strictes (non négociables)

- ❌ Pas de `useEffect` pour data loading de route
- ❌ Pas de fetch direct dans les composants
- ❌ Pas de logique métier dans les composants UI
- ❌ Pas de duplication loader / action
- ❌ Pas d’état local pour refléter des données serveur

---

## Étapes d’exécution attendues

1. **Analyse**
   - Identifier routes concernées
   - Identifier données critiques / secondaires
   - Identifier mutations

2. **Design Data Router**
   - Définir loaders et actions
   - Définir hiérarchie des routes
   - Définir error boundaries

3. **Implémentation**
   - Code TypeScript complet
   - Séparation nette data / UI
   - Navigation cohérente

4. **Gestion états**
   - Chargement (`useNavigation`)
   - Soumission
   - Erreurs
   - États optimistes si requis

---

## Sortie attendue

### Code
- Fichiers complets si créés
- Chemins clairement indiqués
- Aucun code hors périmètre

### Texte
- Explication courte
- Liste des choix structurants
- Pas de tutoriel
- Pas de reformulation de la consigne

---

## Critères de réussite

- Fonctionnalité opérationnelle
- Data chargée avant rendu
- Aucune waterfall
- Navigation fluide
- Erreurs correctement isolées
- Conforme React Router v7

---

## En cas d’ambiguïté
**STOP.**  
Demander clarification avant toute implémentation.
