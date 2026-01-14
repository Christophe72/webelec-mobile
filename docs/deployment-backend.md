# Backend deployment (docker compose)

This guide targets a prod-like deployment using `docker-compose.prod.yml`.

## Prereqs
- Docker + docker compose
- A `.env` file with production values

## Required variables
- POSTGRES_DB
- POSTGRES_USER
- POSTGRES_PASSWORD
- WEBELEC_JWT_SECRET
- NEXT_PUBLIC_API_BASE
- NEXT_PUBLIC_API_URL

## Deploy
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

## Verify
```bash
docker compose -f docker-compose.prod.yml ps
curl http://localhost:8080/actuator/health
```

## Update
```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d --build
```
