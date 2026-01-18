# Guide de Configuration CORS - Sécurité Backend

## 📋 Table des matières
1. [Comprendre la configuration actuelle](#comprendre-la-configuration-actuelle)
2. [Activer/Désactiver la sécurité CORS](#activerdésactiver-la-sécurité-cors)
3. [Exemples de configurations](#exemples-de-configurations)
4. [Troubleshooting](#troubleshooting)

---

## 🔍 Comprendre la configuration actuelle

### Architecture
La configuration CORS utilise **3 fichiers** :

1. **`CorsConfig.java`** - Classe de configuration Spring
   - Lit le profil actif (`dev`, `test`, `prod`)
   - Lit les origines autorisées depuis `application-{profile}.yml`
   - Applique des règles différentes selon le profil

2. **`application-dev.yml`** - Configuration développement
   ```yaml
   cors:
     allowed-origins: "http://localhost:3000,http://localhost:5173,http://localhost:4200"
   ```

3. **`application-prod.yml`** - Configuration production
   ```yaml
   cors:
     allowed-origins: ${CORS_ALLOWED_ORIGINS:https://webelec.com,https://www.webelec.com}
   ```

### Règles selon le profil

#### Mode DÉVELOPPEMENT (`dev` ou `test`)
✅ **Permissif pour faciliter le développement**
- Origines : celles listées dans `application-dev.yml`
- Méthodes HTTP : **TOUTES** (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`, etc.)
- Headers : **TOUS** (pas de restriction)
- Credentials : ✅ Activés (cookies, auth headers)

#### Mode PRODUCTION (`prod`)
🔒 **Restrictif pour la sécurité**
- Origines : celles listées dans `application-prod.yml` ou via variable d'environnement
- Méthodes HTTP : **LIMITÉES** (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`)
- Headers : **RESTREINTS** (`Authorization`, `Content-Type`, `X-Requested-With`)
- Credentials : ✅ Activés

---

## 🔧 Activer/Désactiver la sécurité CORS

### Option 1️⃣ : Modifier les origines autorisées (RECOMMANDÉ)

#### En développement - Autoriser TOUTES les origines

**Fichier :** `src/main/resources/application-dev.yml`

```yaml
# Configuration la plus permissive (bypass total)
cors:
  allowed-origins: "*"
```

**OU** spécifier vos ports de développement :
```yaml
cors:
  allowed-origins: "http://localhost:3000,http://localhost:5173,http://localhost:4200,http://localhost:8081"
```

#### En production - Restreindre aux domaines autorisés

**Fichier :** `src/main/resources/application-prod.yml`

```yaml
# Via variable d'environnement (RECOMMANDÉ)
cors:
  allowed-origins: ${CORS_ALLOWED_ORIGINS:https://webelec.com,https://www.webelec.com}
```

**Variable d'environnement à définir sur le serveur :**
```bash
export CORS_ALLOWED_ORIGINS=https://monsite.com,https://www.monsite.com,https://app.monsite.com
```

---

### Option 2️⃣ : Désactiver complètement CORS (NON RECOMMANDÉ)

Si vous voulez **désactiver CORS temporairement** pour des tests :

#### Méthode A : Commenter les beans dans `CorsConfig.java`

```java
@Configuration
public class CorsConfig {

    // @Bean  // ⬅️ Commenter cette ligne
    public CorsConfigurationSource corsConfigurationSource() {
        // ...
    }

    // @Bean  // ⬅️ Commenter cette ligne
    public WebMvcConfigurer corsConfigurer() {
        // ...
    }
}
```

#### Méthode B : Renommer la classe (désactivation totale)

```java
// @Configuration  // ⬅️ Commenter cette ligne
public class CorsConfig {
    // ...
}
```

⚠️ **ATTENTION** : Ces méthodes désactivent complètement CORS, ce qui peut créer des failles de sécurité !

---

### Option 3️⃣ : Basculer entre les profils

#### Activer le profil de développement (permissif)

**Fichier :** `src/main/resources/application.yml`
```yaml
spring:
  profiles:
    active: dev  # ⬅️ Mode développement
```

**OU** via ligne de commande :
```bash
java -jar backend.jar --spring.profiles.active=dev
```

**OU** via variable d'environnement :
```bash
export SPRING_PROFILES_ACTIVE=dev
```

#### Activer le profil de production (restrictif)

**Fichier :** `src/main/resources/application.yml`
```yaml
spring:
  profiles:
    active: prod  # ⬅️ Mode production
```

**OU** via ligne de commande :
```bash
java -jar backend.jar --spring.profiles.active=prod
```

---

## 📝 Exemples de configurations

### Exemple 1 : Développement avec plusieurs frontends

```yaml
# application-dev.yml
cors:
  allowed-origins: "http://localhost:3000,http://localhost:5173,http://localhost:4200,http://192.168.1.100:3000"
```

### Exemple 2 : Production avec sous-domaines

```yaml
# application-prod.yml
cors:
  allowed-origins: "https://webelec.com,https://www.webelec.com,https://app.webelec.com,https://admin.webelec.com"
```

### Exemple 3 : Production avec wildcard de sous-domaine

Pour autoriser **tous les sous-domaines** en production, modifiez `CorsConfig.java` :

```java
// Dans la section production (ligne 41)
config.setAllowedOriginPatterns(List.of("https://*.webelec.com"));
```

### Exemple 4 : Développement sans restrictions

```yaml
# application-dev.yml
cors:
  allowed-origins: "*"
```

---

## 🐛 Troubleshooting

### Problème : "CORS error: Origin not allowed"

**Solution :** Vérifiez que l'origine est bien dans la liste

1. Ouvrez `application-dev.yml` (ou `application-prod.yml`)
2. Ajoutez votre origine :
   ```yaml
   cors:
     allowed-origins: "http://localhost:3000,http://votrenouvellorigine:8080"
   ```
3. Redémarrez l'application

### Problème : "allowedOrigins cannot contain '*'"

**Cause :** Vous essayez d'utiliser `allowedOrigins("*")` avec `allowCredentials(true)`

**Solution :** Le code actuel utilise déjà `allowedOriginPatterns` qui supporte le wildcard. Vérifiez que vous utilisez bien :
```yaml
cors:
  allowed-origins: "*"  # ✅ Fonctionne avec notre config
```

### Problème : Les changements ne s'appliquent pas

**Solutions :**
1. Vérifiez le profil actif : `spring.profiles.active` dans `application.yml`
2. Nettoyez et recompilez :
   ```bash
   mvn clean compile
   ```
3. Redémarrez complètement l'application

### Problème : Besoin d'autoriser un header custom

Modifiez `CorsConfig.java` ligne 43 :
```java
config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With", "X-Mon-Header-Custom"));
```

---

## 🎯 Résumé rapide

| Action | Fichier à modifier | Ligne |
|--------|-------------------|-------|
| Ajouter une origine en dev | `application-dev.yml` | 28 |
| Ajouter une origine en prod | `application-prod.yml` | 57 |
| Changer le profil actif | `application.yml` | 3 |
| Modifier les règles CORS | `CorsConfig.java` | 24-51 |
| Désactiver CORS | `CorsConfig.java` | 15 (commenter `@Configuration`) |

---

## 📚 Pour aller plus loin

- Documentation Spring CORS : https://docs.spring.io/spring-framework/reference/web/webmvc-cors.html
- OWASP CORS : https://owasp.org/www-community/attacks/CORS_OriginHeaderScrutiny
- MDN CORS : https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

---

**Dernière mise à jour :** Janvier 2026
