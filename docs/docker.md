# Docker usage

This project uses docker compose to orchestrate:
- postgres (db)
- pgadmin (db admin)
- backend (spring boot)
- frontend (next.js)

## Ports
- 5432: postgres
- 5050: pgadmin
- 8080: backend API
- 3000: frontend

## Dev stack
Build and start everything:

```bash
docker compose up -d --build
```

Start only the db + backend:

```bash
docker compose up -d postgres pgadmin backend
```

## Logs
```bash
docker compose logs -f
```

## Stop / remove
```bash
docker compose down
```

Reset db (destroys data and replays init scripts):

```bash
docker compose down -v
```

## Migrations / init
Postgres runs `docker/postgres/init-db.sql` on first init.
Migrations are mounted from `backend/src/main/resources/db/migration`.

## Production
Use the prod compose file and a .env with required variables:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Required variables (examples):
- POSTGRES_DB
- POSTGRES_USER
- POSTGRES_PASSWORD
- WEBELEC_JWT_SECRET
- NEXT_PUBLIC_API_BASE
- NEXT_PUBLIC_API_URL
