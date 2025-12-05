# ============================
#       BUILD
# ============================
FROM node:22 AS build

WORKDIR /app

# Installer les dépendances
COPY package.json package-lock.json* ./
RUN npm install

# Copier tout le frontend
COPY . .

# Build Next.js
RUN npm run build

# ============================
#       RUNTIME
# ============================
FROM node:22-slim AS runtime

WORKDIR /app

COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json .

RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm", "start"]
