# Variables d'environnement - WebElec SaaS

Ce document liste toutes les variables d'environnement utilisées par l'application WebElec SaaS, leurs valeurs par défaut et leur usage.

---

## 🗄️ Base de données PostgreSQL

### Développement (Backend et Frontend locaux, PostgreSQL dans Docker)

| Variable | Valeur | Localisation | Description |
|----------|--------|--------------|-------------|
| `POSTGRES_DB` | `webelec` | docker-compose.yml | Nom de la base de données |
| `POSTGRES_USER` | `postgres` | docker-compose.yml | Utilisateur PostgreSQL |
| `POSTGRES_PASSWORD` | `postgres` | docker-compose.yml | Mot de passe PostgreSQL |

**Configuration du backend local** : `backend/src/main/resources/application-dev.yml`
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/webelec?currentSchema=public
    username: postgres
    password: postgres
```

**Note** : Le backend tourne localement (hors Docker) et se connecte à PostgreSQL via `localhost:5432`.

### Production (Tous les services dans Docker)

| Variable | Valeur | Localisation | Description | Obligatoire |
|----------|--------|--------------|-------------|-------------|
| `SPRING_DATASOURCE_URL` | À définir | docker-compose.prod.yml | URL JDBC complète | ✅ Oui |
| `SPRING_DATASOURCE_USERNAME` | À définir | docker-compose.prod.yml | Utilisateur PostgreSQL | ✅ Oui |
| `SPRING_DATASOURCE_PASSWORD` | À définir | docker-compose.prod.yml | Mot de passe PostgreSQL | ✅ Oui |

**Exemple de configuration production** :
```bash
export POSTGRES_DB="webelec"
export POSTGRES_USER="webelec_prod"
export POSTGRES_PASSWORD="STRONG_PASSWORD_HERE"
export WEBELEC_JWT_SECRET="your-strong-jwt-secret-here"
```

**Note** : En production, tous les services tournent dans Docker et communiquent via le réseau Docker interne.

---

## 🔐 Sécurité & JWT

| Variable | Valeur par défaut | Localisation | Description | Obligatoire |
|----------|-------------------|--------------|-------------|-------------|
| `WEBELEC_JWT_SECRET` | Clé de dev (voir ci-dessous) | application.yml | Clé secrète pour signer les JWT | ✅ Oui (prod) |

**Clé par défaut (DÉVELOPPEMENT SEULEMENT)** :
```
dev-f5e447b965abff7ed55be72b26a0bc68e26efd05ba43937db5c243dd65a4e4bb300c1ed326f4ee90a3d76c8829252fec2e9bc1805aab0aca1850c9952e655f47
```

**⚠️ IMPORTANT** : En production, utilisez une clé forte générée aléatoirement.

**Configuration JWT** (fichier `application.yml`) :
- **Émetteur** : `webelec-backend`
- **Durée de validité Access Token** : 30 minutes (`PT30M`)
- **Durée de validité Refresh Token** : 7 jours (`P7D`)

---

## 🌐 Backend Spring Boot

| Variable | Valeur par défaut | Localisation | Description | Obligatoire |
|----------|-------------------|--------------|-------------|-------------|
| `SPRING_PROFILES_ACTIVE` | `dev` | application.yml ou docker-compose.prod.yml | Profil Spring Boot actif (`dev`, `prod`, `test`) | ✅ Oui |
| `SERVER_PORT` | `8080` | docker-compose.prod.yml | Port du serveur Spring Boot | ❌ Non |
| `BACKEND_PORT` | `8080` | docker-compose.prod.yml | Port exposé du backend | ❌ Non |

---

## 🎨 Frontend Next.js

| Variable | Valeur (Dev) | Localisation | Description | Obligatoire |
|----------|--------------|--------------|-------------|-------------|
| `NEXT_PUBLIC_API_BASE` | `http://localhost:8080/api` | frontend/.env.local | URL de base de l'API backend | ✅ Oui |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080/api` | frontend/.env.local | URL de l'API (même valeur) | ✅ Oui |
| `OPENAI_API_KEY` | À définir | frontend/.env.local | Clé API OpenAI pour embeddings | ✅ Oui (si IA activée) |
| `VECTOR_STORE_ID` | À définir | frontend/.env.local | ID du vector store OpenAI | ✅ Oui (si recherche RGIE) |

**Note** : En développement, le frontend tourne localement. Créez un fichier `frontend/.env.local` avec ces variables.

**Configuration Production Frontend** :
```bash
export NEXT_PUBLIC_API_BASE="https://api.webelec.be/api"
export NEXT_PUBLIC_API_URL="https://api.webelec.be/api"
```

---

## 🔧 PgAdmin (Développement)

| Variable | Valeur | Localisation | Description |
|----------|--------|--------------|-------------|
| `PGADMIN_DEFAULT_EMAIL` | `admin@webelec.be` | docker-compose.yml | Email de connexion PgAdmin |
| `PGADMIN_DEFAULT_PASSWORD` | `admin123` | docker-compose.yml | Mot de passe PgAdmin |

**Accès PgAdmin** : http://localhost:5050

---

## 📦 Fichiers de téléchargement

| Variable | Valeur par défaut | Localisation | Description |
|----------|-------------------|--------------|-------------|
| `app.file.upload-dir` | `uploads` | application.yml | Répertoire de stockage des fichiers uploadés |

**Limites de téléchargement** :
- Taille maximale par fichier : **10 MB**
- Taille maximale par requête : **10 MB**

---

## 🚀 CI/CD & GitHub Actions

### Backend CI

| Variable | Valeur | Workflow | Description |
|----------|--------|----------|-------------|
| Java Version | `21` | backend-ci.yml | Version JDK Temurin |
| Maven Cache | Activé | backend-ci.yml | Cache des dépendances Maven |

**Déclencheurs** :
- Push sur `main` ou `develop`
- Pull Request vers `main` ou `develop`

### Frontend CI

| Variable | Valeur | Workflow | Description |
|----------|--------|----------|-------------|
| Node Version | `24.1.0` | frontend-ci.yml | Version Node.js |
| Package Manager | `pnpm 9` | frontend-ci.yml | Gestionnaire de paquets |

**Déclencheurs** :
- Push sur `main`
- Pull Request vers `main`

---

## 📋 Résumé des configurations par environnement

### Développement (Backend et Frontend locaux)

**Docker Compose (docker-compose.yml)** :
```bash
# PostgreSQL uniquement
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=webelec
```

**Backend (application-dev.yml)** :
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/webelec?currentSchema=public
    username: postgres
    password: postgres
```

**Frontend (frontend/.env.local)** :
```bash
NEXT_PUBLIC_API_BASE=http://localhost:8080/api
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Production (Docker Compose)

**Fichier .env pour docker-compose.prod.yml** :
```bash
# PostgreSQL
POSTGRES_DB=webelec
POSTGRES_USER=webelec_prod
POSTGRES_PASSWORD=<strong_password>

# Backend
BACKEND_PORT=8080
WEBELEC_JWT_SECRET=<your_strong_secret_key>

# Frontend
FRONTEND_PORT=3000
NEXT_PUBLIC_API_BASE=https://api.webelec.be/api
NEXT_PUBLIC_API_URL=https://api.webelec.be/api
OPENAI_API_KEY=<your_openai_key>
VECTOR_STORE_ID=<your_vector_store_id>
```

**Note** : Spring Boot utilise automatiquement `SPRING_DATASOURCE_*` définis dans docker-compose.prod.yml.

---

## ✅ Vérification de la configuration

### Vérifier que PostgreSQL est accessible

```bash
# Depuis le host (développement)
docker exec -it webelec-postgres psql -U postgres -d webelec -c "\dt"

# Vérifier le backend local (développement)
curl http://localhost:8080/actuator/health

# Vérifier le backend en production (dans Docker)
docker exec -it webelec-backend-prod curl http://localhost:8080/actuator/health
```

### Vérifier que le frontend communique avec le backend

```bash
# Tester la connexion depuis le navigateur
curl http://localhost:3000
curl http://localhost:8080/api/auth/me
```

---

## 🛠️ Commandes utiles

### Redémarrer les services Docker

```bash
# Tout redémarrer (supprime les volumes)
docker-compose down -v && docker-compose up -d

# Redémarrer sans supprimer les données
docker-compose restart
```

### Accéder aux logs

**Développement** :
```bash
# Logs PostgreSQL (Docker)
docker-compose logs -f postgres

# Logs du backend
# Affichés dans le terminal où vous avez démarré Spring Boot (./mvnw spring-boot:run)

# Logs du frontend
# Affichés dans le terminal où vous avez démarré Next.js (npm run dev)
```

**Production** :
```bash
# Logs de tous les services
docker-compose -f docker-compose.prod.yml logs -f

# Logs individuels
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f postgres
```

### Exécuter des commandes SQL

```bash
# Via psql dans le conteneur
docker exec -it webelec-postgres psql -U postgres -d webelec

# Depuis PgAdmin
http://localhost:5050
```

---

## 📚 Références

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

---

**Dernière mise à jour** : 2026-01-11
**Version** : 1.0.0
