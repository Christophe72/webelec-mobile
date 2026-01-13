# Changelog - Configuration Docker et Corrections

**Date** : 2026-01-13
**Branche** : `chore/docker-config`
**Type** : Configuration, Correctifs

---

## 🎯 Objectif

Stabiliser la configuration Docker pour l'environnement de développement et résoudre les problèmes de permissions PostgreSQL et d'authentification.

---

## ✅ Problèmes résolus

### 1. Permissions PostgreSQL - ALTER TABLE échoue
**Symptôme** :
```
ERROR: permission denied for schema public
ALTER TABLE ... ADD CONSTRAINT ... failed
```

**Cause** :
- Incohérence entre `docker-compose.yml` et `application-dev.yml`
- `docker-compose.yml` : user=`postgres`, db=`webelec`
- `application-dev.yml` : user=`webelec`, db=`webelec_db`
- L'utilisateur n'avait pas les droits sur le schéma `public`

**Solution** :
- Alignement de tous les fichiers sur `postgres:postgres@webelec`
- Création du script d'initialisation PostgreSQL `docker/postgres/init-db.sql`
- Configuration automatique des permissions au démarrage du conteneur

### 2. Health check retourne 403 Forbidden
**Symptôme** :
```
GET /actuator/health → HTTP 403 Forbidden
```

**Cause** :
- Le filtre JWT `JwtAuthenticationFilter.shouldNotFilter()` retournait toujours `false`
- Tous les endpoints passaient par le filtre, y compris les endpoints publics

**Solution** :
- Modification de `shouldNotFilter()` pour ignorer :
  - `/api/auth/*` (authentification)
  - `/actuator/*` (monitoring)
  - `/swagger-ui/*` et `/v3/api-docs` (documentation)

### 3. Frontend build - Variables d'environnement non définies
**Symptôme** :
```
Error: NEXT_PUBLIC_API_BASE is not defined
```

**Cause** :
- Next.js nécessite les variables d'environnement au moment du build
- Le Dockerfile ne les recevait pas comme build arguments

**Solution** :
- Ajout d'`ARG` et `ENV` dans le Dockerfile frontend
- Configuration des `build.args` dans docker-compose.yml
- Migration de npm vers pnpm (gestionnaire déclaré dans package.json)

---

## 📝 Fichiers modifiés

### Configuration PostgreSQL

#### `backend/src/main/resources/application-dev.yml`
**Changements** :
```yaml
# AVANT
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/webelec_db?currentSchema=public
    username: webelec
    password: webelec_pwd

# APRÈS
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/webelec?currentSchema=public
    username: postgres
    password: postgres
```

**Raison** : Alignement avec la configuration Docker

#### `docker/postgres/init-db.sql` (NOUVEAU)
**Contenu** :
```sql
ALTER SCHEMA public OWNER TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON FUNCTIONS TO postgres;
```

**Raison** : Garantir les permissions complètes pour l'utilisateur `postgres`

### Sécurité Backend

#### `backend/src/main/java/com/webelec/backend/security/JwtAuthenticationFilter.java`
**Changements** :
```java
// AVANT
@Override
protected boolean shouldNotFilter(HttpServletRequest request) {
    return false; // Tous les endpoints passent par le filtre
}

// APRÈS
@Override
protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getRequestURI();
    return path.startsWith("/api/auth/") ||
           path.startsWith("/actuator/") ||
           path.startsWith("/swagger-ui/") ||
           path.startsWith("/v3/api-docs");
}
```

**Raison** : Permettre l'accès aux endpoints publics sans JWT

### Configuration Docker

#### `docker-compose.yml`
**Changements** :
- ✅ Ajout du healthcheck PostgreSQL
- ✅ Montage automatique de `init-db.sql`
- ✅ Ajout du service backend avec healthcheck
- ✅ Ajout du service frontend avec build args
- ✅ Configuration des dépendances entre services

**Structure complète** :
```yaml
services:
  postgres:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    volumes:
      - ./docker/postgres/init-db.sql:/docker-entrypoint-initdb.d/init-db.sql

  backend:
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1"]

  frontend:
    build:
      args:
        NEXT_PUBLIC_API_BASE: "http://localhost:8080/api"
        NEXT_PUBLIC_API_URL: "http://localhost:8080/api"
    depends_on:
      backend:
        condition: service_healthy
```

#### `docker-compose.prod.yml`
**Changements** :
- ✅ Configuration avec variables d'environnement externes
- ✅ Validation des variables obligatoires (`:?` syntax)
- ✅ Healthchecks pour tous les services
- ✅ Sécurité renforcée (pas de hardcoded passwords)

#### `frontend/Dockerfile`
**Changements** :
```dockerfile
# AVANT
FROM node:24.1.0 AS build
COPY package.json package-lock.json* ./
RUN npm install
RUN npm run build

# APRÈS
FROM node:24.1.0 AS build

ARG NEXT_PUBLIC_API_BASE
ARG NEXT_PUBLIC_API_URL

RUN corepack enable && corepack prepare pnpm@9 --activate
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

ENV NEXT_PUBLIC_API_BASE=$NEXT_PUBLIC_API_BASE
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm run build
```

**Raisons** :
- Migration npm → pnpm (cohérence avec package.json)
- Support des build arguments pour Next.js
- Variables d'environnement correctement injectées

### Optimisations

#### `backend/.dockerignore` (NOUVEAU)
```
target/
*.jar
.idea/
*.iml
.vscode/
.DS_Store
*.log
```

#### `frontend/.dockerignore` (NOUVEAU)
```
node_modules/
.next/
out/
.env*
.vscode/
.DS_Store
*.log
```

**Raison** : Accélérer les builds Docker en excluant les fichiers inutiles

### Documentation

#### `ENV_VARIABLES.md` (NOUVEAU)
Documentation complète de toutes les variables d'environnement :
- PostgreSQL (dev et prod)
- Backend Spring Boot
- Frontend Next.js
- JWT et sécurité
- CI/CD
- Résumé par environnement

#### `DOCKER_SETUP_COMPLETE.md` (NOUVEAU)
Récapitulatif complet de la configuration Docker :
- Problèmes résolus
- Configuration actuelle
- Tests de validation
- Commandes utiles
- Fichiers modifiés

#### `DEMARRAGE_LOCAL.md` (NOUVEAU)
Guide pas à pas pour démarrer l'environnement de développement local :
- Prérequis
- Démarrage PostgreSQL
- Démarrage Backend
- Démarrage Frontend
- Vérifications
- Dépannage
- Workflow quotidien

#### `.gitignore`
**Ajouts** :
```
.env*
frontend/.env.local
backend/.env
.env.build
tmpclaude-*
```

**Raison** : Empêcher le commit de fichiers sensibles

---

## 🧪 Tests effectués

### 1. PostgreSQL
```bash
✅ docker exec -it webelec-postgres psql -U postgres -d webelec -c "\dt"
   → Liste toutes les tables sans erreur
```

### 2. Backend Health Check
```bash
✅ curl http://localhost:8080/actuator/health
   → HTTP 200 OK
   → {"status":"UP","components":{"db":{"status":"UP"}}}
```

### 3. Backend Démarrage
```bash
✅ docker logs webelec-backend | grep "Started BackendApplication"
   → Started BackendApplication in 14.426 seconds
```

### 4. Permissions PostgreSQL
```bash
✅ docker logs webelec-backend 2>&1 | grep -i "permission denied"
   → Aucune erreur de permissions
```

### 5. Frontend Build
```bash
✅ docker-compose build frontend
   → Build réussi avec pnpm et variables d'env
```

---

## 📊 Impact

### Développement
- ✅ Environnement de développement stable et reproductible
- ✅ Configuration claire et documentée
- ✅ Deux options : Docker complet OU Backend/Frontend locaux + PostgreSQL Docker
- ✅ Hot reload fonctionnel dans les deux cas

### Production
- ✅ Configuration production sécurisée avec variables d'environnement
- ✅ Healthchecks sur tous les services
- ✅ Dépendances entre services correctement configurées
- ✅ Script d'initialisation PostgreSQL automatique

### Sécurité
- ✅ Pas de credentials hardcodés en production
- ✅ Validation des variables obligatoires
- ✅ Endpoints publics correctement configurés
- ✅ JWT fonctionnel avec filtrage approprié

---

## 🚀 Migration

### Pour les développeurs existants

#### Option 1 : Développement Docker complet
```bash
# Arrêter les anciens conteneurs
docker-compose down -v

# Reconstruire avec la nouvelle configuration
docker-compose build

# Démarrer
docker-compose up -d
```

#### Option 2 : Développement local (RECOMMANDÉ)
```bash
# Arrêter backend et frontend Docker
docker stop webelec-backend webelec-frontend
docker rm webelec-backend webelec-frontend

# Garder uniquement PostgreSQL
docker-compose up -d postgres pgadmin

# Backend local
cd backend
./mvnw spring-boot:run

# Frontend local (autre terminal)
cd frontend
pnpm dev
```

---

## 📚 Références

- [Spring Boot avec Docker](https://spring.io/guides/topicals/spring-boot-docker)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Docker Compose Healthchecks](https://docs.docker.com/compose/compose-file/compose-file-v3/#healthcheck)
- [PostgreSQL Permissions](https://www.postgresql.org/docs/current/ddl-priv.html)

---

## 🔄 Rétrocompatibilité

✅ **Aucune breaking change** pour l'API
✅ **Aucune breaking change** pour les endpoints
✅ **Migration transparente** : les développeurs peuvent continuer à travailler en local

---

## ✨ Améliorations futures possibles

- [ ] Ajouter Nginx reverse proxy pour la production
- [ ] Configurer SSL/TLS pour PostgreSQL en production
- [ ] Ajouter monitoring avec Prometheus + Grafana
- [ ] Configurer backup automatique PostgreSQL
- [ ] Ajouter cache Redis pour améliorer les performances

---

**Auteur** : Claude Sonnet 4.5
**Date** : 2026-01-13
**Statut** : ✅ Prêt pour merge
