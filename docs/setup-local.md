# Local development setup

Recommended workflow: PostgreSQL + PgAdmin + backend in Docker, frontend in local dev.

## Prereqs
- Docker Desktop
- Java 21
- Node.js 24
- pnpm 9

## Start services (Docker)
From the repo root:

```bash
docker compose up -d postgres pgadmin backend
```

## Start frontend (local)
From the repo root:

```bash
cd frontend
pnpm install
pnpm dev
```

## Access
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- PgAdmin: http://localhost:5050

## Health check
```bash
curl http://localhost:8080/actuator/health
```

## Stop
```bash
docker compose stop backend pgadmin postgres
```

## Optional: run frontend in Docker
If you prefer the full stack in Docker:

```bash
docker compose up -d frontend
```

Stop it when you want to continue local dev:

```bash
docker compose stop frontend
```
