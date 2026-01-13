# 🚀 Guide de démarrage - Développement local

**Configuration choisie** : Option 2 (Backend et Frontend locaux + PostgreSQL Docker)

---

## 📋 Prérequis

### Logiciels installés
- ✅ Docker Desktop (pour PostgreSQL)
- ✅ Java 21 (JDK Temurin)
- ✅ Maven 3.9+ (ou utiliser le wrapper `./mvnw`)
- ✅ Node.js 24.1.0
- ✅ pnpm 9

### Vérification des prérequis
```bash
# Vérifier Docker
docker --version
docker-compose --version

# Vérifier Java
java -version

# Vérifier Maven
mvn -version
# OU utiliser le wrapper
./mvnw --version

# Vérifier Node.js
node --version

# Vérifier pnpm
pnpm --version
```

---

## 🐘 Étape 1 : Démarrer PostgreSQL dans Docker

### Démarrer PostgreSQL et PgAdmin
```bash
# Depuis la racine du projet
docker-compose up -d postgres pgadmin
```

### Vérifier que PostgreSQL est démarré
```bash
docker-compose ps

# Vous devriez voir :
# webelec-postgres   Up (healthy)
# webelec-pgadmin    Up
```

### Tester la connexion PostgreSQL
```bash
# Via psql
docker exec -it webelec-postgres psql -U postgres -d webelec -c "SELECT version();"

# Via PgAdmin (navigateur)
# URL: http://localhost:5050
# Email: admin@webelec.be
# Password: admin123
```

**Configuration de connexion dans PgAdmin** :
- Host: `postgres` (si dans Docker) ou `localhost` (depuis votre machine)
- Port: `5432`
- Database: `webelec`
- Username: `postgres`
- Password: `postgres`

---

## ☕ Étape 2 : Démarrer le Backend Spring Boot

### Option A : Avec IntelliJ IDEA (Recommandé)

1. **Ouvrir le projet** :
   - File → Open → Sélectionner le dossier `backend`
   - IntelliJ détectera automatiquement le projet Maven

2. **Configurer le profil** :
   - Run → Edit Configurations
   - Ajouter une nouvelle configuration "Spring Boot"
   - Main class: `com.webelec.backend.BackendApplication`
   - Active profiles: `dev`
   - Cliquer sur OK

3. **Démarrer l'application** :
   - Cliquer sur le bouton ▶️ (Run)
   - Ou utiliser le raccourci `Shift + F10`

4. **Vérifier les logs** :
   ```
   Started BackendApplication in X.XXX seconds
   ```

### Option B : Avec Maven en ligne de commande

```bash
# Depuis le répertoire backend
cd backend

# Démarrer avec le wrapper Maven (recommandé)
./mvnw spring-boot:run

# OU avec Maven installé
mvn spring-boot:run
```

### Vérifier que le backend fonctionne

```bash
# Test du health check
curl http://localhost:8080/actuator/health

# Résultat attendu :
# {"status":"UP","components":{"db":{"status":"UP"},...}}
```

**Le backend est prêt !** 🎉

---

## ⚛️ Étape 3 : Démarrer le Frontend Next.js

### Créer le fichier `.env.local` (première fois uniquement)

```bash
# Depuis le répertoire frontend
cd frontend

# Créer le fichier .env.local
cat > .env.local << 'EOF'
# Backend API
NEXT_PUBLIC_API_BASE=http://localhost:8080/api
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# OpenAI (optionnel, pour les fonctionnalités IA)
# OPENAI_API_KEY=votre_clé_openai
# VECTOR_STORE_ID=votre_vector_store_id
EOF
```

### Installer les dépendances (première fois uniquement)

```bash
pnpm install
```

### Démarrer le serveur de développement

```bash
pnpm dev
```

### Vérifier que le frontend fonctionne

Ouvrir le navigateur : **http://localhost:3000**

**Le frontend est prêt !** 🎉

---

## ✅ Vérification complète

### 1. PostgreSQL
```bash
docker exec -it webelec-postgres psql -U postgres -d webelec -c "\dt"
```
✅ Doit lister toutes les tables

### 2. Backend
```bash
curl http://localhost:8080/actuator/health
```
✅ Doit retourner `{"status":"UP",...}`

### 3. Frontend
Ouvrir **http://localhost:3000** dans le navigateur
✅ La page d'accueil doit s'afficher

### 4. Connexion Frontend ↔ Backend
Dans le navigateur, ouvrir la console et vérifier qu'il n'y a pas d'erreur CORS ou 404 sur les appels API.

---

## 🔧 Commandes utiles

### PostgreSQL Docker

```bash
# Démarrer PostgreSQL
docker-compose up -d postgres

# Arrêter PostgreSQL
docker-compose stop postgres

# Voir les logs PostgreSQL
docker-compose logs -f postgres

# Accéder au shell PostgreSQL
docker exec -it webelec-postgres psql -U postgres -d webelec

# Lister les tables
docker exec -it webelec-postgres psql -U postgres -d webelec -c "\dt"

# Supprimer les données (⚠️ PERTE DE DONNÉES)
docker-compose down -v
```

### Backend Spring Boot

```bash
# Démarrer (avec Maven wrapper)
cd backend
./mvnw spring-boot:run

# Démarrer avec profil de dev explicite
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Compiler sans démarrer
./mvnw clean package

# Exécuter les tests
./mvnw test

# Clean complet
./mvnw clean
```

### Frontend Next.js

```bash
cd frontend

# Démarrer en mode dev
pnpm dev

# Build de production
pnpm build

# Démarrer en mode production
pnpm start

# Linter
pnpm lint

# Tests
pnpm test
```

---

## 🐛 Dépannage

### Backend ne démarre pas

**Erreur : "Port 8080 already in use"**
```bash
# Vérifier ce qui utilise le port 8080
netstat -ano | findstr :8080

# Arrêter le processus ou changer le port dans application-dev.yml
```

**Erreur : "Connection refused to PostgreSQL"**
```bash
# Vérifier que PostgreSQL tourne
docker-compose ps

# Si PostgreSQL n'est pas healthy
docker-compose restart postgres
docker-compose logs postgres
```

### Frontend ne démarre pas

**Erreur : "Port 3000 already in use"**
```bash
# Trouver le processus
netstat -ano | findstr :3000

# Arrêter le processus ou changer le port
# Éditer package.json : "dev": "next dev -p 3001"
```

**Erreur : "NEXT_PUBLIC_API_BASE is not defined"**
```bash
# Vérifier que .env.local existe
cat frontend/.env.local

# Si absent, créer le fichier (voir Étape 3)
```

### Problèmes de permissions PostgreSQL

Si vous voyez des erreurs de permissions `ALTER TABLE ... ADD CONSTRAINT ...` :

```bash
# Recréer la base de données
docker-compose down -v
docker-compose up -d postgres

# Attendre que PostgreSQL soit healthy
docker-compose ps
```

Le script `docker/postgres/init-db.sql` s'exécutera automatiquement au premier démarrage.

---

## 📊 Architecture de développement

```
┌─────────────────────────────────────────────────────────────┐
│                       Navigateur                            │
│                   http://localhost:3000                     │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ Appels API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Frontend Next.js (Local)                       │
│                   Port 3000                                 │
│        pnpm dev (Hot reload activé)                         │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ HTTP GET/POST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│           Backend Spring Boot (Local)                       │
│                   Port 8080                                 │
│      ./mvnw spring-boot:run (Hot reload activé)             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ JDBC
                            ▼
┌─────────────────────────────────────────────────────────────┐
│          PostgreSQL (Docker Container)                      │
│                   Port 5432                                 │
│            docker-compose up -d postgres                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Admin Web UI
                            ▼
┌─────────────────────────────────────────────────────────────┐
│             PgAdmin (Docker Container)                      │
│                   Port 5050                                 │
│         http://localhost:5050                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Avantages de cette configuration

✅ **Hot Reload** : Modifications de code visibles immédiatement
✅ **Debugging facile** : Utilisation des outils de debug de l'IDE
✅ **Performance** : Pas de rebuild Docker à chaque modification
✅ **Isolation DB** : PostgreSQL isolé dans Docker
✅ **Pas de pollution** : Pas besoin d'installer PostgreSQL sur la machine

---

## 📚 Fichiers de configuration importants

| Fichier | Description | Modifications fréquentes |
|---------|-------------|--------------------------|
| `backend/src/main/resources/application-dev.yml` | Config Spring Boot dev | Rarement |
| `frontend/.env.local` | Variables d'env Next.js | Rarement |
| `docker-compose.yml` | Config Docker pour dev | Rarement |
| `backend/pom.xml` | Dépendances Maven | Quand on ajoute des libs |
| `frontend/package.json` | Dépendances npm | Quand on ajoute des libs |

---

## 🔄 Workflow quotidien

### Début de journée

```bash
# 1. Démarrer PostgreSQL
docker-compose up -d postgres pgadmin

# 2. Démarrer le backend (dans un terminal)
cd backend
./mvnw spring-boot:run

# 3. Démarrer le frontend (dans un autre terminal)
cd frontend
pnpm dev

# 4. Ouvrir le navigateur
# http://localhost:3000
```

### Fin de journée

```bash
# 1. Arrêter le frontend (Ctrl+C dans le terminal)
# 2. Arrêter le backend (Ctrl+C dans le terminal)

# 3. Optionnel : Arrêter PostgreSQL
docker-compose stop postgres pgadmin

# OU laisser PostgreSQL tourner (consomme peu de ressources)
```

---

## 🎓 Conseils de développement

### Backend (Spring Boot)

- **Profil dev actif** : Vérifie que `spring.profiles.active=dev` est bien configuré
- **Logs SQL** : Dans `application-dev.yml`, `show_sql: true` affiche les requêtes SQL
- **Hot reload** : Spring Boot DevTools est configuré pour recharger automatiquement

### Frontend (Next.js)

- **Turbopack activé** : Plus rapide que Webpack en dev
- **Variables d'env** : Préfixe `NEXT_PUBLIC_` pour les variables côté client
- **Hot reload** : Automatique avec `pnpm dev`

---

## 📞 Support

En cas de problème :
1. Vérifier les logs de chaque service
2. Consulter `ENV_VARIABLES.md` pour la configuration
3. Consulter `DOCKER_SETUP_COMPLETE.md` pour la config Docker

---

**🎉 Bon développement !**
