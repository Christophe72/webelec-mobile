# WebElec SaaS – Developer Documentation (README.dev.md)

Documentation technique destinée aux développeurs, DevOps et contributeurs.
Ce document décrit l’architecture interne, les choix techniques, les conventions
et les règles à respecter pour garantir la stabilité du SaaS WebElec.

---

## 1. Principes d’architecture

### 1.1 Séparation stricte des responsabilités

- Spring Boot = backend métier (source de vérité)
- Next.js = frontend UI + orchestration
- Aucune logique métier persistante côté Next.js
- Aucun mock métier en production

Cette séparation est volontaire et non négociable.

---

## 2. Architecture globale

Client (Browser)
↓
Next.js (Frontend)
↓
Spring Boot (API REST)
↓
PostgreSQL

Next.js ne parle jamais directement à la base de données.

---

## 3. Backend – Spring Boot

### 3.1 Stack technique

- Java 21
- Spring Boot 3.x
- Spring Security (JWT)
- JPA / Hibernate
- PostgreSQL
- Maven
- Docker

### 3.2 Rôles backend

- Gestion des entités métier
- Validation des règles
- Sécurité (authentification + autorisation)
- Conformité RGIE
- Calculs et cohérence des données

### 3.3 Endpoints REST (exemples)

- GET /api/societes
- POST /api/societes
- GET /api/clients
- GET /api/chantiers
- POST /api/devis
- POST /api/factures

Tous les endpoints métier sont servis par Spring Boot.

---

## 4. Frontend – Next.js

### 4.1 Stack technique

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Fetch API
- Docker

### 4.2 Règle fondamentale

Le frontend refuse de démarrer sans URL backend explicite.

Variable obligatoire :

NEXT_PUBLIC_API_BASE=http://localhost:8080/api

Aucun fallback implicite vers /api n’est autorisé.

---

## 5. Organisation du frontend

frontend/
├─ app/
│ ├─ api/ # routes proxy ou frontend spécifiques
│ ├─ dashboard/
│ ├─ societes/
│ ├─ clients/
│ ├─ chantiers/
│ └─ ...
│
├─ lib/
│ └─ api/
│ └─ base.ts # configuration API backend (strict)
│
├─ public/
├─ package.json
└─ Dockerfile

---

## 6. Règles sur app/api

### 6.1 Ce qui est autorisé

- Proxy explicite vers le backend Spring
- Auth frontend (login/logout/me)
- Upload temporaire (fichiers, images)
- Cas UI spécifiques sans logique métier

### 6.2 Ce qui est interdit

- CRUD métier réel
- Accès base de données
- Mocks en production
- Logique RGIE côté Next.js

---

## 7. Proxy API (pattern officiel)

### 7.1 Utilitaire proxy

app/api/\_proxy/proxyApi.ts :

- Reçoit la requête NextRequest
- Forward vers Spring Boot
- Retourne le status et le body sans modification métier

Toutes les routes proxy doivent utiliser cet utilitaire.

---

## 8. Gestion des mocks

### 8.1 Principe

- Les mocks sont autorisés uniquement en développement
- Jamais exposés sous /app/api en production

### 8.2 Emplacement recommandé

lib/mocks/

- societes.mock.ts
- clients.mock.ts
- chantiers.mock.ts

Activation conditionnelle via NODE_ENV.

---

## 9. Sécurité

### 9.1 Backend

- JWT
- Rôles (ADMIN, GERANT, TECHNICIEN)
- Sécurité centralisée
- Contrôles d’accès stricts

### 9.2 Frontend

- Pas de règles de sécurité métier
- Pas de validation critique
- Simple relais vers backend

---

## 10. Environnement et Docker

### 10.1 Docker Compose

- backend
- frontend
- postgres
- pgadmin

Variables d’environnement injectées explicitement au build.

### 10.2 Rebuild propre

docker compose down
docker compose build --no-cache frontend
docker compose up -d

---

## 11. Bonnes pratiques obligatoires

- Pas de fallback silencieux
- Pas de logique dupliquée
- Pas de mock caché
- Les erreurs doivent casser tôt
- Toute règle métier appartient au backend

---

## 12. Évolution prévue

- RGIE avancé (audit automatique)
- Assistant IA (RAG / MCP)
- Multi-métiers (chauffage, HVAC)
- Facturation électronique (Peppol)
- Dashboards techniques et décisionnels

---

## 13. État du projet

- Architecture validée
- Backend opérationnel
- Frontend connecté au backend réel
- Base saine pour un SaaS long terme

---

## 14. Auteur

Christophe Seyler  
Électricien – Développeur – IoT – Bureau d’étude

---

## 15. Notes finales

Ce document fait partie intégrante du projet.
Toute modification architecturale doit être cohérente avec ce README.dev.md.
