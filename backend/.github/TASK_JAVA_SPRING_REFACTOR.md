# Tâche Codex – Refactorisation Java & Spring (Boot)

## Contexte
Le projet Java utilise :
- Java 8+ (streams, lambdas)
- JDBC direct ou partiel
- threads manuels
- collections classiques (`ArrayList`, `HashMap`, etc.)
- possiblement Spring ou Spring Boot

Le code présente des patterns historiques :
- logique métier dans le `main`
- JDBC non abstrait
- threads créés manuellement
- responsabilités mal séparées
- absence de couches claires (controller / service / repository)

---

## Objectif
Refactoriser le code Java/Spring afin de :
- respecter les **bonnes pratiques Java modernes**
- structurer l’application selon une architecture claire
- préparer le code à la scalabilité, au test et à la performance
- supprimer les patterns obsolètes ou dangereux

Aucune nouvelle fonctionnalité n’est attendue.

---

## Axes de refactorisation

### 1. Architecture globale
- Introduire une séparation claire :
  - Controller (entrée)
  - Service (logique métier)
  - Repository (accès données)
- Supprimer toute logique métier dans :
  - `main`
  - threads
  - classes utilitaires fourre-tout
- Centraliser la configuration (Spring Boot si présent)

---

### 2. Accès aux données (JDBC)
- Supprimer :
  - `Statement`
  - concaténation SQL
- Utiliser :
  - `PreparedStatement`
  - transactions explicites
- Centraliser les accès DB
- Préparer une migration vers :
  - `JdbcTemplate`
  - ou JPA (sans l’implémenter ici)

---

### 3. Concurrence
- Supprimer :
  - `extends Thread`
  - `suspend() / resume()` (interdit)
- Utiliser :
  - `Runnable`
  - `ExecutorService`
  - `Atomic*`
- Identifier les sections critiques
- Supprimer toute concurrence inutile

---

### 4. Collections & streams
- Remplacer les boucles verbeuses par :
  - Stream API quand pertinent
- Éviter :
  - `Vector`
  - `Hashtable`
- Favoriser :
  - `List`, `Set`, `Map` via interfaces
- Supprimer les implémentations abstraites inutiles (`AbstractList` custom sans valeur)

---

### 5. Exceptions
- Supprimer les `catch (Exception e)`
- Introduire :
  - exceptions spécifiques
  - propagation claire
- Aucune exception ne doit être silencieuse
- Logging structuré obligatoire

---

## Règles strictes

- ❌ Pas de JDBC dans le `main`
- ❌ Pas de threads manuels non justifiés
- ❌ Pas de SQL concaténé
- ❌ Pas de logique métier dans les entités
- ❌ Pas de classes utilitaires omniscientes

---

## Étapes attendues

### Étape 1 – Audit
- Identifier :
  - points de couplage fort
  - accès DB non sécurisés
  - problèmes de concurrence
  - collections mal choisies

### Étape 2 – Redesign
- Redéfinir les responsabilités
- Clarifier les flux :
  - entrée → service → data → sortie

### Étape 3 – Implémentation
- Refactorisation incrémentale
- Code plus lisible, testable, maintenable

### Étape 4 – Nettoyage
- Suppression du code mort
- Simplification des classes
- Normalisation du style

---

## Sortie attendue

### Code
- Structure claire
- Accè
