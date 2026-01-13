# Installation n8n Local - WebElec

Guide spécifique pour l'installation du workflow sur votre **n8n self-hosted** (local).

---

## 🏠 Avantages de n8n local

- ✅ **Gratuit** - Pas de limite d'exécutions
- ✅ **Contrôle total** - Vos données restent chez vous
- ✅ **Performance** - Pas de latence cloud
- ✅ **Personnalisation** - Modules npm custom possibles

---

## 📋 Prérequis

### Vérifier votre installation n8n

```bash
# Vérifier la version de n8n
n8n --version

# Si n8n n'est pas installé, l'installer :
npm install -g n8n

# Ou avec Docker :
docker --version
```

### Ports et accès

- **n8n local** : <http://localhost:5678> (par défaut)
- **Base de données** : SQLite (par défaut) ou PostgreSQL

---

## 🚀 Installation du workflow

### Méthode 1 : Import via l'interface (Recommandé)

1. **Démarrer n8n** (si pas déjà lancé)

   ```bash
   n8n start
   ```

2. **Ouvrir l'interface**

   - Navigateur : <http://localhost:5678>

3. **Importer le workflow**

   - Menu **Workflows** (icône en haut à gauche)
   - Cliquer sur **Import from File**
   - Sélectionner : `workflow-webelec-n8n.json`
   - Le workflow s'ouvre automatiquement

4. **Sauvegarder**
   - Ctrl+S ou bouton **Save** en haut à droite
   - Nommer : "WebElec - Gestion demandes"

### Méthode 2 : Import CLI (Avancé)

```bash
# Se placer dans le dossier n8n
cd C:\Users\chris\.claude-worktrees\landing-page-webelec\focused-borg\n8n

# Importer le workflow
n8n import:workflow --input=workflow-webelec-n8n.json

# Lister les workflows
n8n list:workflow
```

---

## 🔑 Configuration des credentials

Contrairement à n8n Cloud, en local vous devez configurer OAuth2 manuellement.

### 1. Gmail OAuth2

#### Créer les credentials Google Cloud

1. **Aller sur Google Cloud Console**

   - <https://console.cloud.google.com/>

2. **Créer un projet** (ou utiliser existant)

   - Nom : "n8n-webelec"

3. **Activer l'API Gmail**

   - Menu → APIs & Services → Library
   - Rechercher "Gmail API"
   - Cliquer sur "Enable"

4. **Créer des credentials OAuth2**

   - APIs & Services → Credentials
   - Create Credentials → OAuth client ID
   - Type : **Web application**
   - Nom : "n8n local"
   - Authorized redirect URIs :

     ```text
     http://localhost:5678/rest/oauth2-credential/callback
     ```

   - Créer

5. **Copier les credentials**
   - Client ID : `1234567890-abcdefg.apps.googleusercontent.com`
   - Client Secret : `GOCSPX-xxxxxxxxxxxxxx`
   - **SAUVEGARDER** ces informations !

#### Configurer dans n8n (Gmail)

1. Dans n8n, cliquer sur le node **Gmail Trigger**
2. Section **Credential to connect with**
3. Create New → **Gmail OAuth2**
4. Remplir :
   - **Client ID** : coller celui de Google Cloud
   - **Client Secret** : coller celui de Google Cloud
5. Cliquer sur **Connect my account**
6. Autoriser l'accès Gmail
7. Nommer : "Gmail - WebElec"
8. Save

**Important** : Répéter pour TOUS les nodes Gmail du workflow (ou réutiliser le même credential).

---

### 2. OpenAI API

Plus simple que Gmail :

1. Node **AI Analysis (GPT-4o)**
2. Create New Credential → **OpenAI**
3. Coller votre **API Key** OpenAI
4. Tester la connexion
5. Nommer : "OpenAI - WebElec"
6. Save

---

### 3. Google Sheets OAuth2

Même processus que Gmail :

#### Si pas déjà fait, activer l'API Google Sheets

1. Google Cloud Console (même projet)
2. APIs & Services → Library
3. Rechercher "Google Sheets API"
4. Enable

#### Utiliser les mêmes credentials OAuth2

Vous pouvez **réutiliser** les mêmes Client ID/Secret que pour Gmail.

#### Configurer dans n8n

1. Node **Save to Google Sheets**
2. Create New → **Google Sheets OAuth2**
3. Remplir Client ID + Client Secret (mêmes que Gmail)
4. Connect my account
5. Autoriser
6. Nommer : "Google Sheets - WebElec"
7. Save

---

## ⚙️ Configuration spécifique n8n local

### Variables d'environnement (optionnel)

Si vous voulez externaliser les configurations :

1. **Créer un fichier `.env` dans le dossier n8n** :

```bash
# .env (dans le dossier où vous lancez n8n)

# Configuration n8n
N8N_HOST=localhost
N8N_PORT=5678
N8N_PROTOCOL=http

# Timezone
GENERIC_TIMEZONE=Europe/Brussels

# Base de données (optionnel, par défaut SQLite)
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=localhost
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n_user
DB_POSTGRESDB_PASSWORD=your_password

# Email (pour notifications d'erreur)
N8N_EMAIL_MODE=smtp
N8N_SMTP_HOST=smtp.hostinger.com
N8N_SMTP_PORT=587
N8N_SMTP_USER=support@webelec.be
N8N_SMTP_PASS=your_password
N8N_SMTP_SENDER=support@webelec.be

# OpenAI (si vous voulez l'externaliser)
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
```

1. **Démarrer n8n avec les variables** :

```bash
# Windows
set -a
source .env
set +a
n8n start

# Ou directement :
n8n start --env-file=.env
```

---

### Configurer le polling Gmail

Par défaut, le workflow vérifie **toutes les minutes**.

Pour économiser des ressources en local :

1. Node **Gmail Trigger**
2. Section **Poll Times**
3. Choisir :
   - Every minute (recommandé)
   - Every 5 minutes
   - Every 15 minutes
   - Custom (cron expression)

Exemple cron (toutes les 2 minutes) :

```js
*/2 * * * *
```

---

## 🗄️ Base de données (PostgreSQL recommandé)

Pour la production, **PostgreSQL** est recommandé au lieu de SQLite.

### Installation PostgreSQL

#### Windows (si pas déjà installé)

1. Télécharger : <https://www.postgresql.org/download/windows/>
2. Installer avec les paramètres par défaut
3. Créer une base de données :

```sql
-- Dans psql ou pgAdmin
CREATE DATABASE n8n;
CREATE USER n8n_user WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE n8n TO n8n_user;
```

### Configurer n8n avec PostgreSQL

```bash
# Variables d'environnement
export DB_TYPE=postgresdb
export DB_POSTGRESDB_HOST=localhost
export DB_POSTGRESDB_PORT=5432
export DB_POSTGRESDB_DATABASE=n8n
export DB_POSTGRESDB_USER=n8n_user
export DB_POSTGRESDB_PASSWORD=votre_mot_de_passe

# Démarrer n8n
n8n start
```

---

## 🐳 Alternative : Docker (Recommandé pour production)

Si vous utilisez Docker :

### docker-compose.yml

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: n8n_user
      POSTGRES_PASSWORD: votre_mot_de_passe
      POSTGRES_DB: n8n
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  n8n:
    image: n8nio/n8n:latest
    restart: always
    environment:
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n_user
      - DB_POSTGRESDB_PASSWORD=votre_mot_de_passe
      - N8N_PROTOCOL=http
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - GENERIC_TIMEZONE=Europe/Brussels
      - WEBHOOK_URL=http://localhost:5678/
    ports:
      - "5678:5678"
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - postgres

volumes:
  postgres_data:
  n8n_data:
```

### Démarrer avec Docker

```bash
# Se placer dans le dossier contenant docker-compose.yml
cd C:\Users\chris\.claude-worktrees\landing-page-webelec\focused-borg\n8n

# Démarrer
docker-compose up -d

# Voir les logs
docker-compose logs -f n8n

# Arrêter
docker-compose down
```

---

## 🔄 Mise à jour du workflow

Si vous modifiez le workflow :

### Sauvegarder manuellement

1. Dans n8n → Menu (3 points) → **Download**
2. Sauvegarder le JSON

### Importer une nouvelle version

1. Menu → **Import from File**
2. Sélectionner le nouveau JSON
3. Les credentials existantes seront préservées

---

## 🚀 Lancer n8n au démarrage (Windows)

Pour que n8n démarre automatiquement :

### Méthode 1 : Service Windows (pm2)

```bash
# Installer pm2
npm install -g pm2
npm install -g pm2-windows-startup

# Configurer pm2 pour démarrer au boot
pm2-startup install

# Démarrer n8n avec pm2
pm2 start n8n

# Sauvegarder la configuration
pm2 save

# Vérifier le statut
pm2 status

# Voir les logs
pm2 logs n8n
```

### Méthode 2 : Tâche planifiée Windows

1. Ouvrir **Planificateur de tâches**
2. Créer une tâche de base
3. Nom : "n8n WebElec"
4. Déclencheur : **Au démarrage de l'ordinateur**
5. Action : **Démarrer un programme**
6. Programme : `C:\Program Files\nodejs\n8n.cmd`
7. Terminer

---

## 📊 Monitoring local

### Logs en temps réel

```bash
# Avec pm2
pm2 logs n8n

# Sans pm2 (démarrage manuel)
# Les logs s'affichent dans la console
n8n start
```

### Accès à l'historique

1. Interface n8n : <http://localhost:5678>
2. Menu **Executions** (icône horloge à gauche)
3. Voir toutes les exécutions passées

### Alertes par email

Configurer n8n pour vous envoyer un email si un workflow échoue :

```bash
# Variables d'environnement
export N8N_EMAIL_MODE=smtp
export N8N_SMTP_HOST=smtp.hostinger.com
export N8N_SMTP_PORT=587
export N8N_SMTP_USER=support@webelec.be
export N8N_SMTP_PASS=votre_mot_de_passe
export N8N_SMTP_SENDER=support@webelec.be

# Puis dans l'interface n8n :
# Settings → Workflow → Error Workflow
```

---

## 🔒 Sécurité en local

### Activer l'authentification

Si n8n est accessible depuis le réseau :

```bash
# Variables d'environnement
export N8N_BASIC_AUTH_ACTIVE=true
export N8N_BASIC_AUTH_USER=admin
export N8N_BASIC_AUTH_PASSWORD=VotreMotDePasseSecurisé

n8n start
```

### HTTPS (production)

Pour un accès externe sécurisé :

1. Utiliser un reverse proxy (nginx, Caddy)
2. Configurer un certificat SSL (Let's Encrypt)
3. Rediriger le port 443 vers 5678

---

## 🐛 Dépannage spécifique local

### ❌ "Cannot connect to database"

**Solution :**

```bash
# Vérifier que PostgreSQL est démarré
# Windows : Services → PostgreSQL

# Tester la connexion
psql -U n8n_user -d n8n -h localhost
```

### ❌ "Port 5678 already in use"

**Solution :**

```bash
# Trouver le processus
netstat -ano | findstr :5678

# Tuer le processus (remplacer PID)
taskkill /PID 12345 /F

# Ou changer le port
export N8N_PORT=5679
n8n start
```

### ❌ "Gmail OAuth redirect URI mismatch"

**Solution :**

- Vérifier dans Google Cloud Console que l'URI est exactement :

  ```text
  http://localhost:5678/rest/oauth2-credential/callback
  ```

- Pas de `/` à la fin
- Respecter le port (5678 par défaut)

### ❌ Workflow ne se déclenche pas

**Solution :**

```bash
# Vérifier que n8n tourne
pm2 status
# ou
curl http://localhost:5678

# Vérifier les logs
pm2 logs n8n

# Vérifier que le workflow est ACTIF
# Interface n8n → Switch "Active" = ON
```

---

## 📈 Performance et optimisation

### Limiter la RAM utilisée

```bash
# Limiter Node.js à 512 MB
export NODE_OPTIONS="--max-old-space-size=512"
n8n start

# Ou 1 GB
export NODE_OPTIONS="--max-old-space-size=1024"
```

### Archiver les anciennes exécutions

```bash
# Configurer la rétention (garder 30 jours)
export EXECUTIONS_DATA_PRUNE=true
export EXECUTIONS_DATA_MAX_AGE=30

n8n start
```

### Backup automatique

Script PowerShell pour backup quotidien :

```powershell
# backup-n8n.ps1

$backupDir = "C:\backups\n8n"
$date = Get-Date -Format "yyyy-MM-dd"

# Créer le dossier si inexistant
New-Item -ItemType Directory -Force -Path $backupDir

# Backup PostgreSQL
$env:PGPASSWORD = "votre_mot_de_passe"
pg_dump -U n8n_user -h localhost -d n8n > "$backupDir\n8n_$date.sql"

# Backup workflows (via API)
Invoke-WebRequest -Uri "http://localhost:5678/rest/workflows" `
  -Method GET `
  -OutFile "$backupDir\workflows_$date.json"

Write-Host "Backup terminé : $backupDir\n8n_$date.sql"
```

Planifier dans **Planificateur de tâches Windows** (tous les jours à 2h du matin).

---

## 🆘 Support

### Ressources

- **n8n Docs** : <https://docs.n8n.io/hosting/installation/>
- **Forum n8n** : <https://community.n8n.io/>
- **GitHub** : <https://github.com/n8n-io/n8n>

### Commandes utiles

```bash
# Version de n8n
n8n --version

# Mettre à jour n8n
npm update -g n8n

# Réinitialiser les credentials
n8n reset

# Export tous les workflows
n8n export:workflow --all --output=workflows-backup.json

# Import workflow
n8n import:workflow --input=workflow.json
```

---

## ✅ Checklist finale

Avant d'activer le workflow :

- [ ] n8n installé et démarré (<http://localhost:5678>)
- [ ] Google Cloud Project créé
- [ ] Gmail API activée
- [ ] Google Sheets API activée
- [ ] Credentials OAuth2 créés (Client ID + Secret)
- [ ] Workflow importé dans n8n
- [ ] 3 credentials configurés (Gmail, OpenAI, Sheets)
- [ ] Google Sheet créé avec les bonnes colonnes
- [ ] Test du workflow effectué (Execute Workflow)
- [ ] Email de confirmation reçu
- [ ] Données dans Google Sheets
- [ ] Workflow activé (switch ON)

---

## Votre n8n local est maintenant prêt ! 🚀

## Configuration pour WebElec - 2025
