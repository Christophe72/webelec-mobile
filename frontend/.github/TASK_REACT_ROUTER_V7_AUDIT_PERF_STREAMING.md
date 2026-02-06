# Tâche Codex – Audit Performance & Streaming React Router v7

## Contexte
Cette tâche s’applique à une application utilisant **React Router v7.x** avec :
- Data Router (`createBrowserRouter`)
- Loaders / Actions
- Suspense / Await potentiellement utilisés
- React 18+ (concurrent rendering actif)

L’application peut présenter :
- temps de chargement excessifs
- rendus bloquants
- streaming mal exploité
- loaders trop lourds ou mal structurés
- navigation perçue comme lente

Le contexte React Router v7 fourni est **référence absolue**.

---

## Objectif
Réaliser un **audit complet des performances liées au routage et au data loading**, en se concentrant sur :
- parallélisme des loaders
- usage (ou absence) du streaming (`defer`, `Await`)
- blocages de navigation
- granularité des loaders
- perception utilisateur lors des transitions

AUCUNE modification de code fonctionnelle n’est attendue dans cette tâche.

---

## Axes d’analyse

### 1. Loaders & parallélisme
- Identifier les loaders exécutés séquentiellement
- Détecter les appels réseau inutiles ou redondants
- Vérifier :
  - `Promise.all` vs await en cascade
  - données critiques vs secondaires

### 2. Streaming & defer
- Vérifier l’utilisation de :
  - `defer`
  - `<Await>`
  - `<Suspense>`
- Identifier les données pouvant être streamées
- Détecter :
  - données non critiques bloquant le rendu
  - Suspense global trop large

### 3. Navigation & perception
- Analyser :
  - `useNavigation().state`
  - indicateurs de chargement
- Identifier les routes :
  - sans feedback utilisateur
  - avec chargement silencieux
- Vérifier la granularité des loaders enfants

### 4. Revalidation
- Identifier les revalidations excessives
- Vérifier l’usage de :
  - `useRevalidator`
  - fetchers
- Détecter les rafraîchissements globaux inutiles

### 5. Code splitting & lazy routes
- Vérifier l’utilisation de `lazy()`
- Identifier :
  - bundles trop lourds
  - routes rarement utilisées non splittées
- Analyser coût initial vs coût différé

---

## Méthodologie attendue

### Étape 1 – Cartographie
- Lister toutes les routes
- Associer :
  - loader(s)
  - action(s)
  - données chargées
- Identifier les dépendances entre routes

### Étape 2 – Analyse runtime
- Identifier :
  - points bloquants
  - délais perceptibles
  - loaders critiques
- Évaluer le rendu :
  - time-to-first-render
  - time-to-interactive

### Étape 3 – Streaming potentiel
- Classer les données en :
  - critiques
  - différables
- Proposer des candidats à `defer`
- Identifier les Suspense à affiner

---

## Règles strictes

- ❌ Aucune modification fonctionnelle
- ❌ Aucun refactor structurel
- ❌ Aucun ajout de `defer` dans cette tâche
- ❌ Aucun changement d’API

Cette tâche est **diagnostique uniquement**.

---

## Sortie attendue

### Rapport d’audit
Format libre mais structuré, incluant :

#### 1. Synthèse
- État global des performances
- Problèmes majeurs identifiés

#### 2. Liste des problèmes
Pour chaque problème :
- Route concernée
- Loader / action concerné
- Cause probable
