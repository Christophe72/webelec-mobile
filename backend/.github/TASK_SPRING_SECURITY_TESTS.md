# Tâche Codex – Tests de sécurité Spring (MockMvc & WebTestClient)
SYSTEM_ROLE: executor
OUTPUT_FORMAT: markdown
## Contexte
L’application utilise :
- Spring Security
- JWT et/ou OAuth2
- API stateless
- contrôles d’accès basés sur scopes / rôles

La configuration de sécurité est en place et durcie.  
Elle doit maintenant être verrouillée par des tests automatisés afin d’éviter toute régression future.

## Objectif
Mettre en place une suite de tests de sécurité qui :
- valide strictement les règles d’accès
- détecte toute régression de configuration
- empêche toute montée de privilège involontaire
- documente implicitement la politique de sécurité

Les tests doivent échouer avant qu’un bug de sécurité n’atteigne la production.

## Outils

### Stack MVC / Servlet
- MockMvc
- spring-security-test

### Stack WebFlux / Reactive
- WebTestClient
- spring-security-test

## Principes de test (non négociables)

- Tester le refus avant l’autorisation
- Chaque endpoint critique doit avoir au minimum :
  - 1 test 401 Unauthorized
  - 1 test 403 Forbidden
  - 1 test autorisé avec droits minimaux
- Aucun test ne dépend d’un vrai provider OAuth
- Tous les tokens sont mockés
- Les tests décrivent la politique réelle, pas une version idéalisée

## Catégories de tests obligatoires

### 1. Accès sans authentification
Vérifier que l’API est réellement protégée.

Cas à tester :
- requête sans header Authorization
- header mal formé
- token vide

Attendu :
- 401 Unauthorized
- aucun message exploitable côté client

### 2. Token invalide
Cas à tester :
- token expiré
- token mal signé
- algorithme incorrect
- issuer invalide
- audience invalide

Attendu :
- 401 Unauthorized
- rejet immédiat sans ambiguïté

### 3. Token valide mais droits insuffisants
Cas à tester :
- scope manquant
- rôle insuffisant
- scope partiel
- scope incorrect

Attendu :
- 403 Forbidden
- aucune élévation implicite de privilèges

### 4. Token valide et autorisé
Cas à tester :
- token avec scope minimal requis
- accès exactement autorisé (pas plus)

Attendu :
- 200 OK ou 204 No Content
- comportement fonctionnel attendu

### 5. Isolation métier / sécurité
Vérifier que :
- un endpoint public reste public
- un endpoint protégé le reste
- une refactorisation ne casse pas la politique de sécurité

## Implémentation – MockMvc

### Dépendance
testImplementation "org.springframework.security:spring-security-test"

### Endpoint protégé sans authentification
mockMvc.perform(get("/api/admin"))
    .andExpect(status().isUnauthorized());

### Accès autorisé avec JWT mocké
mockMvc.perform(get("/api/admin")
    .with(jwt().authorities(
        new SimpleGrantedAuthority("SCOPE_admin")
    )))
    .andExpect(status().isOk());

### Scope insuffisant
mockMvc.perform(get("/api/admin")
    .with(jwt().authorities(
        new SimpleGrantedAuthority("SCOPE_user")
    )))
    .andExpect(status().isForbidden());

## Implémentation – WebTestClient

### Appel sans authentification
webTestClient.get()
    .uri("/api/admin")
    .exchange()
    .expectStatus().isUnauthorized();

### JWT mocké avec autorisation
webTestClient.mutateWith(
    mockJwt().authorities(
        new SimpleGrantedAuthority("SCOPE_admin")
    )
)
.get()
.uri("/api/admin")
.exchange()
.expectStatus().isOk();

## Tests négatifs obligatoires

- scope inattendu ignoré
- scope admin non suffisant sans règle explicite
- endpoint non déclaré explicitement refusé
- méthode HTTP non prévue refusée
- fallback permissif inexistant

## Règles strictes

- Aucun test avec token réel
- Aucun endpoint sans test de sécurité
- Aucun accès implicite
- Pas de @WithMockUser sans justification claire (préférer JWT)
- Pas de dépendance à l’ordre d’exécution des tests

## Sortie attendue

### Code
- Tests organisés par controller ou par route
- Noms explicites :
  - shouldReturn401WhenNoToken
  - shouldReturn403WhenScopeMissing
  - shouldAllowAccessWithAdminScope

### Documentation implicite
- Les tests reflètent exactement la politique de sécurité réelle
- Un audit peut comprendre les règles sans lire la configuration

## Critère de réussite
- Toute modification des règles de sécurité casse un test
- Toute élévation de privilège accidentelle est détectée
- La politique de sécurité est verrouillée par le CI

## En cas d’ambiguïté
STOP.  
Demander clarification avant d’assouplir une règle de sécurité.

## Mini-projet Java prêt à tester

Objectif : fournir un projet minimal Spring Boot (MVC + Security + JWT mock) pour écrire les tests ci-dessus.
Le projet n’intègre pas de vrai provider OAuth. Les tokens sont mockés via spring-security-test.

### Structure minimale

```
mini-security-tests/
├─ build.gradle
├─ settings.gradle
└─ src/
   ├─ main/
   │  ├─ java/com/example/securitydemo/
   │  │  ├─ SecurityDemoApplication.java
   │  │  ├─ config/SecurityConfig.java
   │  │  └─ web/AdminController.java
   │  └─ resources/application.yml
   └─ test/
      └─ java/com/example/securitydemo/
         └─ web/AdminControllerSecurityTest.java
```

### build.gradle (Gradle Groovy)

```
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.7'
    id 'io.spring.dependency-management' version '1.1.5'
}

group = 'com.example'
version = '0.0.1-SNAPSHOT'

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-oauth2-resource-server'

    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.springframework.security:spring-security-test'
}

test {
    useJUnitPlatform()
}
```

### SecurityDemoApplication.java

```
package com.example.securitydemo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SecurityDemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(SecurityDemoApplication.class, args);
    }
}
```

### SecurityConfig.java

```
package com.example.securitydemo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public").permitAll()
                .requestMatchers("/api/admin").hasAuthority("SCOPE_admin")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        return http.build();
    }
}
```

### AdminController.java

```
package com.example.securitydemo.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AdminController {

    @GetMapping("/public")
    public ResponseEntity<String> publicEndpoint() {
        return ResponseEntity.ok("public");
    }

    @GetMapping("/admin")
    public ResponseEntity<String> adminEndpoint() {
        return ResponseEntity.ok("admin");
    }
}
```

### AdminControllerSecurityTest.java (MockMvc)

```
package com.example.securitydemo.web;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AdminControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReturn401WhenNoToken() throws Exception {
        mockMvc.perform(get("/api/admin"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldReturn403WhenScopeMissing() throws Exception {
        mockMvc.perform(get("/api/admin")
            .with(SecurityMockMvcRequestPostProcessors.jwt()
                .authorities(new SimpleGrantedAuthority("SCOPE_user"))
            ))
            .andExpect(status().isForbidden());
    }

    @Test
    void shouldAllowAccessWithAdminScope() throws Exception {
        mockMvc.perform(get("/api/admin")
            .with(SecurityMockMvcRequestPostProcessors.jwt()
                .authorities(new SimpleGrantedAuthority("SCOPE_admin"))
            ))
            .andExpect(status().isOk());
    }

    @Test
    void shouldAllowPublicEndpointWithoutAuth() throws Exception {
        mockMvc.perform(get("/api/public"))
            .andExpect(status().isOk());
    }
}
```

### application.yml

```
spring:
  main:
    allow-bean-definition-overriding: true
```

### Utilisation rapide

```
./gradlew test
```

Ce mini-projet sert de base pour étendre les tests obligatoires (401/403/OK) et verrouiller la politique de sécurité.
