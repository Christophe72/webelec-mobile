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
