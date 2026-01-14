# Environment variables

This is a short list of the variables used in dev/prod. The canonical values
for dev are in `.env` (root) and `frontend/.env.local`.

## Database
- POSTGRES_DB
- POSTGRES_USER
- POSTGRES_PASSWORD

## Backend
- SPRING_DATASOURCE_URL
- SPRING_DATASOURCE_USERNAME
- SPRING_DATASOURCE_PASSWORD
- SPRING_PROFILES_ACTIVE (dev/prod/test)
- WEBELEC_JWT_SECRET (shared with frontend server)

## Frontend
- NEXT_PUBLIC_API_BASE
- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_API_AUTH_DISABLED (dev only, set to true to bypass proxy auth)

## Examples
Root `.env` (Docker):

```bash
WEBELEC_JWT_SECRET=dev-f5e447b965abff7ed55be72b26a0bc68e26efd05ba43937db5c243dd65a4e4bb300c1ed326f4ee90a3d76c8829252fec2e9bc1805aab0aca1850c9952e655f47
```

Frontend `.env.local` (local dev):

```bash
NEXT_PUBLIC_API_BASE=http://localhost:8080/api
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_API_AUTH_DISABLED=true
```
