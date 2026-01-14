-- Script d'initialisation PostgreSQL pour WebElec SaaS

-- Appliquer les migrations de schema au premier demarrage
\i /docker-entrypoint-initdb.d/migrations/V1__init.sql
\i /docker-entrypoint-initdb.d/migrations/V2__user_societes.sql
\i /docker-entrypoint-initdb.d/migrations/V3__user_multi_societe.sql

ALTER SCHEMA public OWNER TO postgres;

GRANT ALL PRIVILEGES ON SCHEMA public TO postgres;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO postgres;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO postgres;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO postgres;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON FUNCTIONS TO postgres;
