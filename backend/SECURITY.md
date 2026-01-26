# Guide de Sécurité - Backend WebElec SaaS

## 🔒 Configuration pour la Production

### Variables d'environnement obligatoires

Avant de déployer en production, assurez-vous de définir les variables d'environnement suivantes :

#### 1. **Secret JWT** (CRITIQUE)
```bash
# Générer un secret sécurisé de 64 caractères minimum
WEBELEC_JWT_SECRET=$(openssl rand -base64 64)
```

**⚠️ NE JAMAIS utiliser le secret par défaut du fichier `application.yml` en production !**

Le système refusera de démarrer si le secret commence par `dev-`.

#### 2. **Base de données**
```bash
DATABASE_URL=jdbc:postgresql://hostname:5432/webelec_prod
DB_USER=webelec_user
DB_PASSWORD=<mot_de_passe_fort>
```

#### 3. **CORS** (Obligatoire en production)
```bash
# Remplacer par vos domaines réels
CORS_ALLOWED_ORIGINS=https://app.webelec.com,https://www.webelec.com
```

**⚠️ Ne JAMAIS utiliser `*` en production !**

### Profils Spring

- **`dev`** : Mode développement (authentification simplifiée, logs verbeux)
- **`test`** : Mode test automatisé (H2 en mémoire)
- **`prod`** : Mode production (validations strictes, logs minimaux)

Pour activer le profil de production :
```bash
SPRING_PROFILES_ACTIVE=prod
```

---

## 🛡️ Fonctionnalités de Sécurité

### Authentication JWT
- **Access Token** : 30 minutes (configurable)
- **Refresh Token** : 7 jours (configurable)
- Signature HMAC-SHA256
- Validation stricte (signature + expiration + utilisateur)

### Protection CSRF
- Désactivé (mode stateless avec JWT)
- Les cookies ne sont pas utilisés pour l'authentification

### Headers de Sécurité HTTP (Production uniquement)
- `X-XSS-Protection: 1; mode=block`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

### CORS
- Configuration différenciée dev/prod
- Mode permissif en dev pour faciliter le développement
- Mode restrictif en prod avec origines explicites

### Rate Limiting
⚠️ **À IMPLÉMENTER** : Actuellement non implémenté. Recommandé d'ajouter un rate limiter sur `/api/auth/login` pour prévenir les attaques par force brute.

---

## ✅ Checklist de Déploiement

Avant de déployer en production :

- [ ] Le profil `prod` est activé (`SPRING_PROFILES_ACTIVE=prod`)
- [ ] Variable `WEBELEC_JWT_SECRET` définie avec un secret cryptographiquement sécurisé (64+ caractères)
- [ ] Variable `DATABASE_URL` pointe vers la base de données de production
- [ ] Variable `DB_USER` et `DB_PASSWORD` définies
- [ ] Variable `CORS_ALLOWED_ORIGINS` définie avec les domaines frontend réels (pas `*`)
- [ ] Les logs sont configurés au niveau `INFO` (pas `DEBUG`)
- [ ] Les endpoints Actuator sont sécurisés (seul `/actuator/health` exposé)
- [ ] HTTPS est activé au niveau du reverse proxy (Nginx, ALB, etc.)
- [ ] Les secrets ne sont PAS commités dans le code source
- [ ] La base de données utilise des migrations (Flyway/Liquibase)

---

## 🚨 Vulnérabilités Connues à Adresser

### Haute Priorité

1. **Rate Limiting manquant**
   - Impact : Attaques par force brute sur le login
   - Solution : Implémenter Bucket4j ou Spring Security rate limiting

2. **Pas de validation de complexité des mots de passe**
   - Impact : Utilisateurs peuvent créer des mots de passe faibles
   - Solution : Ajouter une validation côté backend (min 8 caractères, chiffres, symboles)

### Moyenne Priorité

3. **Logs JWT trop verbeux en production**
   - ✅ **CORRIGÉ** : Les détails techniques ne sont loggés qu'en mode DEBUG

4. **Actuator endpoints exposés**
   - ✅ **CORRIGÉ** : Seul `/actuator/health` est exposé en production

---

## 📝 Bonnes Pratiques

### Gestion des Secrets
- ✅ Utiliser des variables d'environnement
- ✅ Ne jamais committer les secrets dans Git
- ✅ Rotation régulière des secrets (tous les 90 jours)
- ❌ Ne jamais logger les tokens JWT complets

### Mise à Jour des Dépendances
```bash
# Vérifier les vulnérabilités
mvn dependency-check:check

# Mettre à jour les dépendances
mvn versions:display-dependency-updates
```

### Surveillance
- Monitorer les tentatives de connexion échouées
- Alerter sur les exceptions JWT répétées
- Suivre les métriques d'authentification

---

## 🔧 Développement Local

En mode développement (`dev`), la sécurité est assouplie pour faciliter le travail :

- CORS accepte toutes les origines
- Un filtre d'authentification automatique est activé (`DevAuthenticationFilter`)
- Les logs sont plus verbeux
- Swagger UI est accessible sans authentification

**⚠️ Le profil `dev` ne doit JAMAIS être utilisé en production !**

---

## 📞 Contact Sécurité

Pour signaler une vulnérabilité de sécurité, contactez : security@webelec.com

**Ne pas créer d'issue publique sur GitHub pour les problèmes de sécurité.**
