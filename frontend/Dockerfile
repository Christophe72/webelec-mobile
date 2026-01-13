# ============================
#       BUILD
# ============================
FROM node:24.1.0 AS build

# Arguments de build pour les variables d'environnement Next.js
ARG NEXT_PUBLIC_API_BASE
ARG NEXT_PUBLIC_API_URL

WORKDIR /app

# Installer pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

# Installer les dépendances
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Copier tout le frontend
COPY . .

# Exporter les variables d'environnement pour le build Next.js
ENV NEXT_PUBLIC_API_BASE=$NEXT_PUBLIC_API_BASE
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build Next.js
RUN pnpm run build

# ============================
#       RUNTIME
# ============================
FROM node:24.1.0-slim AS runtime

WORKDIR /app

# Installer pnpm et wget pour les healthchecks
RUN corepack enable && corepack prepare pnpm@9 --activate && \
    apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json .
COPY --from=build /app/pnpm-lock.yaml* .

RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000

CMD ["pnpm", "start"]
