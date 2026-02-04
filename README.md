# WebElec SaaS

WebElec is a management and compliance platform for electricians.
It combines a Next.js frontend, a Spring Boot backend, and PostgreSQL.

## Quick start (recommended)

Start the database and backend in Docker:

```bash
docker compose up -d postgres pgadmin backend
```

Run the frontend locally:

```bash
cd frontend
pnpm install
pnpm dev
```

## Access
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- PgAdmin: http://localhost:5050

## Troubleshooting

### Backend modifié mais pas de changement ?
Si vous modifiez le code backend Java (controllers, services, etc.), vous devez reconstruire l'image Docker :

```bash
docker compose build backend
docker compose up -d backend
```

**Note importante** : Le backend tourne dans un conteneur Docker qui copie les fichiers compilés lors du build. Les modifications du code Java ne sont pas prises en compte automatiquement - un rebuild est nécessaire.

### Frontend : variables d'environnement non prises en compte ?
Si vous modifiez `.env.local`, redémarrez le serveur Next.js :

```bash
# Arrêter (Ctrl+C)
# Puis redémarrer
pnpm dev
```

Les variables `NEXT_PUBLIC_*` sont injectées au build time et nécessitent un redémarrage.

## Documentation
- docs/README.md (index)
- docs/setup-local.md
- docs/docker.md
- docs/env.md
- docs/tests.md
- docs/deployment-backend.md
- docs/user-guide.md
- backend/README.md
- frontend/README.md

## Architecture
- Frontend: Next.js + TypeScript
- Backend: Spring Boot (Java 21)
- Database: PostgreSQL 16
