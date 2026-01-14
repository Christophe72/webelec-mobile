# Tests and validation

## Smoke checks
```bash
docker compose ps
curl http://localhost:8080/actuator/health
```

List tables in Postgres:
```bash
docker exec -it webelec-postgres psql -U postgres -d webelec -c "\\dt"
```

## Backend tests
```bash
cd backend
./mvnw test
```

## Frontend tests
```bash
cd frontend
pnpm test
```
