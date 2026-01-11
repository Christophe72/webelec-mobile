# Configuration Docker pour WebElec SaaS (Environnement de Développement)

## Vue d'ensemble

Cette configuration Docker est optimisée pour le **développement local**. Seuls PostgreSQL et pgAdmin s'exécutent dans Docker, tandis que le backend et le frontend s'exécutent directement sur votre machine locale.

## Services Docker

### PostgreSQL
- **Port**: 5432
- **Base de données**: `webelec`
- **Utilisateur**: `postgres`
- **Mot de passe**: `postgres`
- **Volume**: Les données sont persistées dans `postgres_data`

### pgAdmin
- **Port**: 5050
- **URL**: http://localhost:5050
- **Email**: admin@webelec.be
- **Mot de passe**: admin123
- **Volume**: Les configurations sont persistées dans `pgadmin_data`

## Démarrage rapide

### 1. Démarrer les services Docker

```bash
docker-compose up -d
```

Cette commande va :
- Créer et démarrer le conteneur PostgreSQL
- Créer et démarrer le conteneur pgAdmin
- Exécuter automatiquement le script d'initialisation `init-db.sql`

### 2. Vérifier que les services sont démarrés

```bash
docker-compose ps
```

Vous devriez voir :
```
NAME                 IMAGE                    STATUS
webelec-postgres     postgres:16              Up
webelec-pgadmin      dpage/pgadmin4:8.9       Up
```

### 3. Vérifier les logs

```bash
# Logs PostgreSQL
docker logs webelec-postgres

# Logs pgAdmin
docker logs webelec-pgadmin
```

## Configuration de la base de données

### État initial de la base de données

Lorsque vous démarrez les conteneurs pour la **première fois**, la base de données `webelec` est créée **vide** avec :
- ✅ La base de données `webelec` créée
- ✅ Les permissions configurées pour l'utilisateur `postgres`
- ❌ **Aucune table créée**

### Dois-je créer les tables manuellement ?

**Non, les tables seront créées automatiquement par votre backend Spring Boot.**

Spring Boot utilise JPA/Hibernate qui peut créer automatiquement les tables au démarrage si vous avez configuré :

Dans votre fichier `backend/src/main/resources/application-dev.yml` :

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update  # ou create-drop pour un environnement de développement
```

Options disponibles :
- `create-drop` : Supprime et recrée les tables à chaque démarrage (utile en développement)
- `create` : Crée les tables au démarrage
- `update` : Met à jour le schéma sans supprimer les données
- `validate` : Valide uniquement que le schéma correspond aux entités
- `none` : Ne fait rien (vous devez gérer les migrations manuellement)

## Connexion à la base de données

### Depuis votre backend Spring Boot local

Votre fichier `application-dev.yml` devrait contenir :

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/webelec
    username: postgres
    password: postgres
    driver-class-name: org.postgresql.Driver
  jpa:
    database-platform: org.hibernate.dialect.PostgreSQLDialect
    hibernate:
      ddl-auto: update
    show-sql: true  # Affiche les requêtes SQL dans les logs (utile en dev)
```

### Depuis pgAdmin

1. Ouvrez http://localhost:5050
2. Connectez-vous avec :
   - Email: `admin@webelec.be`
   - Mot de passe: `admin123`

3. Ajoutez un nouveau serveur :
   - **Onglet General** :
     - Name: `WebElec Local`

   - **Onglet Connection** :
     - Host: `postgres` (nom du service Docker)
     - Port: `5432`
     - Database: `webelec`
     - Username: `postgres`
     - Password: `postgres`

4. Cliquez sur "Save"

### Depuis un outil externe (DBeaver, DataGrip, etc.)

- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `webelec`
- **Username**: `postgres`
- **Password**: `postgres`

## Commandes utiles

### Arrêter les services

```bash
docker-compose stop
```

### Démarrer les services (s'ils sont arrêtés)

```bash
docker-compose start
```

### Arrêter et supprimer les conteneurs (garde les volumes de données)

```bash
docker-compose down
```

### Arrêter et supprimer TOUT (conteneurs + volumes de données)

```bash
docker-compose down -v
```

⚠️ **Attention** : Cette commande supprime toutes les données de la base de données !

### Recréer la base de données depuis zéro

Si vous voulez repartir d'une base de données vide :

```bash
# Arrêter et supprimer tout
docker-compose down -v

# Redémarrer
docker-compose up -d
```

### Voir les logs en temps réel

```bash
# Tous les services
docker-compose logs -f

# Seulement PostgreSQL
docker-compose logs -f postgres

# Seulement pgAdmin
docker-compose logs -f pgadmin
```

### Accéder au shell PostgreSQL

```bash
docker exec -it webelec-postgres psql -U postgres -d webelec
```

Commandes psql utiles :
- `\dt` - Lister toutes les tables
- `\d nom_table` - Décrire une table
- `\l` - Lister toutes les bases de données
- `\q` - Quitter

## Workflow de développement recommandé

### 1. Démarrage du projet

```bash
# Terminal 1 : Démarrer Docker
docker-compose up -d

# Terminal 2 : Démarrer le backend Spring Boot
cd backend
./mvnw spring-boot:run

# Terminal 3 : Démarrer le frontend Next.js
cd frontend
npm run dev
```

### 2. Pendant le développement

- Le backend se connecte à `localhost:5432`
- Le frontend se connecte au backend sur `localhost:8080`
- Utilisez pgAdmin (http://localhost:5050) pour explorer la base de données
- Les modifications du code backend/frontend sont prises en compte avec hot-reload
- La base de données reste active en arrière-plan

### 3. Fin de journée

```bash
# Arrêter le backend et frontend (Ctrl+C dans leurs terminaux)

# Optionnel : Arrêter Docker (ou le laisser tourner)
docker-compose stop
```

## Migrations de base de données

### Option 1 : Hibernate auto-ddl (développement)

Laissez Spring Boot gérer le schéma avec `ddl-auto: update`

### Option 2 : Flyway ou Liquibase (recommandé pour la production)

Pour un contrôle plus fin des migrations, utilisez Flyway :

1. Ajoutez la dépendance dans `pom.xml` :
```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

2. Créez vos scripts de migration dans `src/main/resources/db/migration/` :
   - `V1__init.sql`
   - `V2__add_users_table.sql`
   - etc.

3. Configurez dans `application-dev.yml` :
```yaml
spring:
  flyway:
    enabled: true
  jpa:
    hibernate:
      ddl-auto: validate  # Ne laisse plus Hibernate modifier le schéma
```

## Dépannage

### Le conteneur PostgreSQL ne démarre pas

```bash
# Voir les logs
docker logs webelec-postgres

# Vérifier que le port 5432 n'est pas déjà utilisé
# Windows
netstat -an | findstr 5432

# Linux / macOS
netstat -an | grep 5432
# ou
lsof -i :5432

# Alternative multi-plateforme : vérifier que le conteneur PostgreSQL est en cours d'exécution
docker ps | grep webelec-postgres
```

### Erreur "database already exists"

C'est normal si vous redémarrez les conteneurs sans supprimer les volumes.

### Je veux réinitialiser complètement la base de données

```bash
docker-compose down -v
docker-compose up -d
```

### Le script init-db.sql ne s'exécute pas

Le script `init-db.sql` s'exécute **uniquement lors de la première création** du volume PostgreSQL.

Pour forcer sa réexécution :
```bash
docker-compose down -v  # Supprime le volume
docker-compose up -d    # Recrée tout
```

### Problème de connexion depuis le backend

Vérifiez que :
1. Le conteneur PostgreSQL est bien démarré : `docker-compose ps`
2. L'URL de connexion utilise `localhost` (pas `postgres`) : `jdbc:postgresql://localhost:5432/webelec`
3. Le port 5432 est bien exposé

## Structure des fichiers

```
docker/
├── postgres/
│   └── init-db.sql         # Script d'initialisation PostgreSQL
└── README.md               # Ce fichier

docker-compose.yml          # Configuration Docker
```

## Sécurité

⚠️ **Les credentials actuels sont pour le développement uniquement !**

En production :
- Utilisez des mots de passe forts
- Stockez les credentials dans des variables d'environnement ou un vault
- N'exposez pas les ports publiquement
- Utilisez des certificats SSL/TLS

## Environnement de production

Pour la production, utilisez `docker-compose.prod.yml` qui devrait inclure :
- Le backend et frontend dans Docker
- Des secrets sécurisés
- Des health checks
- Des configurations de ressources (CPU, mémoire)
- Des stratégies de backup automatiques
