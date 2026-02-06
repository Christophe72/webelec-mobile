# Tâche Codex – Sécurité & Authentification Spring Security

## Contexte
Le projet Java utilise **Spring / Spring Boot** avec :
- endpoints HTTP (REST ou MVC)
- authentification partielle ou inexistante
- configuration Spring Security minimale ou legacy
- logique de sécurité dispersée (filtres, annotations, conditions manuelles)

Des problèmes possibles :
- règles de sécurité implicites
- endpoints exposés par défaut
- logique d’authentification couplée au métier
- gestion confuse des rôles / permissions
- absence de séparation authN / authZ

---

## Objectif
Refondre la sécurité applicative afin de :
- garantir un **périmètre d’accès explicite**
- séparer clairement :
  - authentification (qui est l’utilisateur)
  - autorisation (ce qu’il a le droit de faire)
- rendre la configuration lisible, testable et maintenable
- préparer l’application à :
  - JWT
  - OAuth2
  - SSO
  - APIs publiques vs privées

Aucune nouvelle fonctionnalité métier.

---

## Modèle de sécurité cible

### Concepts clairs
- **Authentication** : identité (username, token, principal)
- **Authorization** : permissions (roles, scopes, authorities)
- **Security Context** : état de la requête
- **Boundary explicite** : tout est fermé par défaut

---

## Axes de refactorisation

### 1. Configuration Spring Security
- Supprimer :
  - configurations héritées obscures
  - filtres custom non documentés
- Centraliser la configuration :
  - `SecurityFilterChain`
- Rendre explicite :
  - endpoints publics
  - endpoints protégés
- Principe : **deny-by-default**

---

### 2. Authentification
- Isoler la logique d’authentification :
  - UserDetailsService
  - AuthenticationProvider
- Supprimer toute authentification :
  - manuelle
  - conditionnelle dans les controllers
- Ne jamais lire directement les credentials dans le métier

---

### 3. Autorisation
- Clarifier la stratégie :
  - rôles (`ROLE_ADMIN`)
  - ou authorities (`SCOPE_read`)
- Utiliser :
  - `@PreAuthorize`
  - expressions lisibles
- Supprimer :
  - `if (user.isAdmin())` dans le code métier
- Toute règle d’accès doit être :
  - traçable
  - centralisée
  - testable

---

### 4. Gestion des utilisateurs
- Séparer :
  - entité User (métier)
  - UserDetails (sécurité)
- Ne jamais exposer :
  - mot de passe
  - hash
  - informations sensibles
- Encodage obligatoire via `PasswordEncoder`

---

### 5. Tokens / Sessions
Selon le contexte du projet :
- Session-based OU token-based (pas les deux)
- Si JWT :
  - validation stateless
  - pas de logique métier dans le filtre
- Aucune dépendance directe du code métier au transport auth

---

### 6. Erreurs & réponses HTTP
- Distinguer clairement :
  - 401 Unauthorized (non authentifié)
  - 403 Forbidden (non autorisé)
- Supprimer les erreurs génériques
- Messages neutres (pas de fuite d’information)

---

## Règles strictes (non négociables)

- ❌ Aucun endpoint exposé implicitement
- ❌ Aucune logique de sécurité dans les services métier
- ❌ Aucune vérification utilisateur via `if/else`
- ❌ Aucun accès direct au `SecurityContext` hors couche dédiée
- ❌ Aucun secret en clair (code, logs, exceptions)

---

## Étapes attendues

### Étape 1 – Audit sécurité
- Lister tous les endpoints
- Identifier :
  - accès publics involontaires
  - contrôles dupliqués
  - incohérences authN / authZ

---

### Étape 2 – Redesign sécurité
- Définir :
  - modèle d’authentification
  - modèle d’autorisation
- Documenter la politique d’accès

---

### Étape 3 – Implémentation
- Configuration Spring Security lisible
- Annotations d’autorisation explicites
- Nettoyage des contrôles manuels

---

### Étape 4 – Nettoyage
- Suppression du code mort
- Harmonisation des réponses d’erreur
- Logging sécurité minimal mais utile

---

## Périmètre technique autorisé

- Spring Security (SecurityFilterChain)
- UserDetailsService
- AuthenticationProvider
- PasswordEncoder
- @PreAuthorize / @PostAuthorize
- JWT **uniquement si déjà présent**
- OAuth2 **uniquement si déjà présent**

---

## Sortie attendue

### Code
- Configuration de sécurité claire et commentée
- Controllers sans logique de sécurité métier
- Services indépendants du contexte auth

### Documentation
- Tableau endpoints → permissions
- Choix de sécurité justifiés
- Limitations connues

---

## Critère de réussite
Un développeur Spring expérimenté doit pouvoir :
- comprendre la politique de sécurité en 5 minutes
- identifier rapidement qui a accès à quoi
- faire évoluer l’auth sans toucher au métier
