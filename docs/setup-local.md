# Local development setup

Deux workflows sont supportés :

1. **Tout en Docker** (PostgreSQL + backend + PgAdmin)
2. **PostgreSQL installé localement** + backend lancé en direct (sans Docker)

Le frontend reste dans tous les cas en mode `pnpm dev`.

## Prérequis communs

- Java 21
- Node.js 24 + `pnpm@9`
- Accès à PostgreSQL (Docker Desktop **ou** installation locale)

---

## Option A — Backend + PostgreSQL en Docker

### Démarrer les services

Depuis la racine du dépôt :

```bash
docker compose up -d postgres pgadmin backend
```

### Accès rapides

- Frontend : http://localhost:3000
- Backend API : http://localhost:8080
- PgAdmin : http://localhost:5050

### Health check API

```bash
curl http://localhost:8080/actuator/health
```

### Arrêter les services Docker

```bash
docker compose stop backend pgadmin postgres
```

### Frontend dans Docker (optionnel)

```bash
docker compose up -d frontend
```

Stoppe le conteneur quand tu repasses en `pnpm dev` :

```bash
docker compose stop frontend
```

---

## Option B — PostgreSQL installé localement (sans Docker)

1. **Démarre ton service PostgreSQL** (Windows Service, Homebrew, apt…).
2. **Crée une base dédiée** (une seule fois) :
   ```bash
    createdb webelec
   # ou via psql
    psql -h localhost -U postgres -c "CREATE DATABASE webelec;"
   ```
3. **Exporte les credentials** dans le terminal qui lancera le backend.
   - PowerShell :
     ```powershell
       $env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/webelec?currentSchema=public"
     $env:SPRING_DATASOURCE_USERNAME="postgres"
     $env:SPRING_DATASOURCE_PASSWORD="postgres"
     ```
   - bash :
     ```bash
       export SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/webelec?currentSchema=public"
     export SPRING_DATASOURCE_USERNAME=postgres
     export SPRING_DATASOURCE_PASSWORD=postgres
     ```
     Adapte évidemment user/mot de passe/port à ton installation.
4. **Lance le backend en profil `dev`** :
   ```bash
   cd backend
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
   ```
   (Sous Windows, utilise `mvnw.cmd`.)

Tant que ces variables restent dans ta session, l’API utilisera ta base locale sans nécessiter Docker.

---

## Frontend en local

```bash
cd frontend
pnpm install
pnpm dev
```

Le frontend consomme l’API via l’URL définie dans `frontend/.env.local` (`NEXT_PUBLIC_API_BASE`).

---

## Vérifier / dépanner

- API : http://localhost:8080/actuator/health
- Base locale : `psql -h localhost -U <user> -d webelec`
- Logs backend : terminal où tourne `mvnw`
