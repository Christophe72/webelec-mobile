# Tâche Codex – Audit & Correctifs Performance Java / Spring

## Contexte
Le projet Java présente :
- accès JDBC directs
- traitements concurrents
- collections potentiellement inefficaces
- streams mal utilisés
- risques de fuites de ressources

Cette tâche est **non fonctionnelle**, orientée performance et sûreté.

---

## Objectif
Identifier et corriger :
- goulets d’étranglement
- risques concurrents
- fuites JDBC
- usages CPU/mémoire inefficaces

Sans modifier le comportement observable.

---

## Axes d’audit

### 1. JDBC
- Vérifier :
  - fermeture des ressources
  - transactions cohérentes
- Identifier :
  - requêtes répétitives
  - absence d’index supposés
- Mutualiser les connexions
- Éviter toute requête dans une boucle non bornée

---

### 2. Concurrence
- Identifier :
  - accès concurrents non protégés
  - collections non thread-safe
- Remplacer :
  - verrous manuels par structures concurrentes
- Supprimer toute concurrence artificielle

---

### 3. Collections
- Vérifier les choix :
  - `ArrayList` vs `LinkedList`
  - `HashMap` vs `ConcurrentHashMap`
- Supprimer :
  - structures synchronisées obsolètes (`Vector`, `Hashtable`)
- Éviter les copies inutiles

---

### 4. Streams
- Éviter :
  - streams infinis non bornés
  - `stream().forEach()` à effet de bord
- Identifier les streams coûteux
- Remplacer par boucle classique si plus lisible/perf

---

### 5. Mémoire
- Identifier :
  - objets longue durée
  - collections jamais nettoyées
- Vérifier les références statiques
- Supprimer les caches non maîtrisés

---

## Correctifs attendus

- Amélioration mesurable ou justifiée
- Code plus prévisible
- Aucun micro-optimisation inutile
- Lisibilité > optimisation marginale

---

## Sortie attendue

### Code
- Modifications ciblées
- Commentaires explicatifs si nécessaire

### Rapport
- Liste des problèmes détectés
- Correctifs appliqués
- Risques résiduels éventuels

---

## Critère de réussite
Application plus stable, plus prévisible, sans complexité inutile.
