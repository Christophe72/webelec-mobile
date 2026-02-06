# Tâche Codex – Hardening JWT & OAuth2 (Spring Security)

## Contexte
Le projet utilise **Spring Security** avec :
- authentification **JWT** et/ou **OAuth2**
- API stateless
- tokens transmis via Authorization header
- configuration parfois minimale ou héritée

Risques fréquents :
- validation incomplète des tokens
- scopes ou rôles mal utilisés
- durée de vie excessive des tokens
- dépendance forte au fournisseur OAuth
- erreurs d’auth mal différenciées

---

## Objectif
Renforcer la sécurité JWT / OAuth2 afin de :
- garantir l’intégrité et la validité des tokens
- éviter toute escalade de privilèges
- isoler l’infrastructure OAuth du métier
- rendre la configuration robuste, explicite et testable
- limiter l’impact d’un token compromis

Aucun changement fonctionnel métier.

---

## Principes de sécurité (obligatoires)

- **Stateless strict**
- **Fail closed** (tout refusé si ambigu)
- **Validation complète du token à chaque requête**
- **Le token ne donne que ce qui est explicitement accordé**
- **Zéro confiance côté client**

---

## Axes de hardening

### 1. Validation JWT
- Vérifier systématiquement :
  - signature
  - algorithme attendu (pas de fallback)
  - issuer (`iss`)
  - audience (`aud`)
  - expiration (`exp`)
  - not-before (`nbf`)
- Refuser :
  - tokens sans scope
  - tokens avec claims inattendus critiques
- Aucun claim ne doit être utilisé sans validation

---

### 2. Durée de vie des tokens
- JWT d’accès :
  - courte durée de vie
- Refresh token :
  - usage unique
  - stockage sécurisé
- Interdire :
  - tokens longs pour usage humain
- Expliciter la stratégie de rotation

---

### 3. Scopes, rôles et authorities
- Choisir **un seul modèle** :
  - scopes OU roles
- Mapper explicitement :
  - `scope` → `GrantedAuthority`
- Ne jamais supposer :
  - admin implicite
  - scope global
- Vérifier l’absence de privilèges excessifs

---

### 4. OAuth2 Provider isolation
- Isoler la configuration OAuth2 :
  - client ID
  - secrets
  - URLs
- Aucun code métier ne dépend :
  - du provider
  - des claims bruts
- Préparer le remplacement du provider sans refonte

---

### 5. Filtres & Security Chain
- Limiter les filtres custom
- Aucune logique métier dans les filtres
- Ordre des filtres explicite
- Journalisation minimale (sans fuite de token)

---

### 6. Erreurs et réponses
- 401 :
  - token absent
  - token invalide
  - token expiré
- 403 :
  - token valide mais droits insuffisants
- Messages neutres
- Aucune information exploitable pour l’attaquant

---

## Menaces à couvrir explicitement

- Rejeu de token
- Token volé
- Token forgé (algorithme none / confusion RSA-HMAC)
- Escalade de privilèges par scope
- Mauvais mapping claim → authority
- Dépendance excessive au fournisseur OAuth

---

## Règles strictes (non négociables)

- ❌ Aucun token stocké côté serveur hors refresh si justifié
- ❌ Aucun JWT accepté sans validation complète
- ❌ Aucun accès basé sur des claims non documentés
- ❌ Aucun fallback silencieux
- ❌ Aucun log de token ou secret

---

## Étapes attendues

### Étape 1 – Audit JWT/OAuth2
- Identifier :
  - paramètres manquants
  - validations absentes
  - scopes surdimensionnés
- Cartographier :
  - endpoints → scopes

---

### Étape 2 – Renforcement
- Compléter la validation JWT
- Verrouiller les algorithmes
- Restreindre les scopes
- Clarifier les mappings

---

### Étape 3 – Nettoyage
- Supprimer les hacks de compatibilité
- Supprimer les claims inutiles
- Normaliser les réponses d’erreur

---

## Sortie attendue

### Code
- Configuration de sécurité renforcée
- Mapping clair scopes → permissions
- Filtres simples et lisibles

### Documentation
- Politique de tokens (durée, rotation)
- Schéma scopes / rôles
- Risques résiduels assumés

---

## Critère de réussite
Un audit sécurité externe doit conclure que :
- un token compromis a un impact limité
- aucun privilège implicite n’existe
- la configuration est explicite et robuste
