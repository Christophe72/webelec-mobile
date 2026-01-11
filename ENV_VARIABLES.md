# Variables d'environnement - WebElec SaaS

Ce document liste toutes les variables d'environnement utilisées par l'application WebElec SaaS, leurs valeurs par défaut et leur usage.

---

## 🗄️ Base de données PostgreSQL

### Développement (Docker)

| Variable | Valeur | Localisation | Description |
|----------|--------|--------------|-------------|
| `POSTGRES_DB` | `webelec` | docker-compose.yml | Nom de la base de données |
| `POSTGRES_USER` | `postgres` | docker-compose.yml | Utilisateur PostgreSQL |
| `POSTGRES_PASSWORD` | `postgres` | docker-compose.yml | Mot de passe PostgreSQL |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://postgres:5432/webelec` | docker-compose.yml → backend | URL JDBC pour Spring Boot |
| `SPRING_DATASOURCE_USERNAME` | `postgres` | docker-compose.yml → backend | Utilisateur pour Spring Boot |
| `SPRING_DATASOURCE_PASSWORD` | `postgres` | docker-compose.yml → backend | Mot de passe pour Spring Boot |

**Fichier de configuration Spring Boot** : `backend/src/main/resources/application-dev.yml`
```yaml
spring:
  datasource:
    url: jdbc:postgresql://postgres:5432/webelec?currentSchema=public
    username: postgres
    password: postgres
```

### Production

| Variable | Valeur | Localisation | Description | Obligatoire |
|----------|--------|--------------|-------------|-------------|
| `DATABASE_URL` | À définir | application-prod.yml | URL JDBC complète | ✅ Oui |
| `DB_USER` | À définir | application-prod.yml | Utilisateur PostgreSQL | ✅ Oui |
| `DB_PASSWORD` | À définir | application-prod.yml | Mot de passe PostgreSQL | ✅ Oui |

**Exemple de configuration production** :
```bash
export DATABASE_URL="jdbc:postgresql://prod-db-host:5432/webelec?currentSchema=public&ssl=true"
export DB_USER="webelec_prod"
export DB_PASSWORD="STRONG_PASSWORD_HERE"
```

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
| `SPRING_PROFILES_ACTIVE` | `dev` | docker-compose.yml | Profil Spring Boot actif (`dev`, `prod`, `test`) | ✅ Oui |
| `PORT` | `8080` | application-prod.yml | Port du serveur Spring Boot | ❌ Non |

---

## 🎨 Frontend Next.js

| Variable | Valeur (Dev) | Localisation | Description | Obligatoire |
|----------|--------------|--------------|-------------|-------------|
| `NEXT_PUBLIC_API_BASE` | `http://localhost:8080/api` | docker-compose.yml | URL de base de l'API backend | ✅ Oui |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080/api` | docker-compose.yml | URL de l'API (même valeur) | ✅ Oui |
| `OPENAI_API_KEY` | À définir | .env.example | Clé API OpenAI pour embeddings | ✅ Oui (si IA activée) |
| `VECTOR_STORE_ID` | À définir | .env.example | ID du vector store OpenAI | ✅ Oui (si recherche RGIE) |

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

### Développement (Docker Compose)

```bash
# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=webelec

# Backend
SPRING_PROFILES_ACTIVE=dev
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/webelec
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres

# Frontend
NEXT_PUBLIC_API_BASE=http://localhost:8080/api
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Production

```bash
# PostgreSQL (environnement externe ou service managé)
DATABASE_URL=jdbc:postgresql://<host>:<port>/<database>?currentSchema=public&ssl=true
DB_USER=<production_user>
DB_PASSWORD=<strong_password>

# Backend
SPRING_PROFILES_ACTIVE=prod
WEBELEC_JWT_SECRET=<your_strong_secret_key>
PORT=8080

# Frontend
NEXT_PUBLIC_API_BASE=https://api.webelec.be/api
NEXT_PUBLIC_API_URL=https://api.webelec.be/api
OPENAI_API_KEY=<your_openai_key>
VECTOR_STORE_ID=<your_vector_store_id>
```

---

## ✅ Vérification de la configuration

### Vérifier que PostgreSQL est accessible

```bash
# Depuis le host
docker exec -it webelec-postgres psql -U postgres -d webelec -c "\dt"

# Depuis le backend
docker exec -it webelec-backend curl http://localhost:8080/actuator/health
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

```bash
# Logs du backend
docker-compose logs -f backend

# Logs de PostgreSQL
docker-compose logs -f postgres

# Logs du frontend
docker-compose logs -f frontend
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
