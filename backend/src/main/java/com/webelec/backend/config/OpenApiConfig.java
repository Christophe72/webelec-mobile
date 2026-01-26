package com.webelec.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configuration de la documentation OpenAPI (Swagger).
 *
 * Cette configuration génère automatiquement la documentation interactive de l'API
 * accessible via Swagger UI.
 */
@Configuration
public class OpenApiConfig {

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    @Bean
    public OpenAPI customOpenAPI() {
        // Définir le schéma de sécurité JWT
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("WebElec SaaS API")
                        .version("1.0.0")
                        .description("""
                                API REST pour la gestion d'entreprises d'électricité.

                                ## Authentification

                                Cette API utilise JWT (JSON Web Tokens) pour l'authentification.

                                ### Comment s'authentifier :

                                1. **Se connecter** via `/api/auth/login` avec vos identifiants
                                2. **Récupérer** le `accessToken` de la réponse
                                3. **Cliquer** sur le bouton "Authorize" 🔓 en haut à droite
                                4. **Entrer** : `Bearer <votre_access_token>`
                                5. **Tester** les endpoints protégés

                                ### Rafraîchir le token :

                                Utilisez `/api/auth/refresh` avec votre `refreshToken` pour obtenir un nouveau `accessToken`.

                                ## Architecture Multi-Tenant

                                L'application supporte plusieurs sociétés clientes (multi-tenant).
                                Chaque utilisateur appartient à une ou plusieurs sociétés et les données sont isolées par société.

                                ## Environnement Actuel

                                Profil Spring actif : **""" + activeProfile + """
                                **
                                """)
                        .contact(new Contact()
                                .name("WebElec Team")
                                .email("contact@webelec.com"))
                        .license(new License()
                                .name("Propriétaire")
                                .url("https://webelec.com")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("Serveur de développement local"),
                        new Server()
                                .url("https://api.webelec.com")
                                .description("Serveur de production")
                ))
                // Configuration de l'authentification JWT
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Entrez le token JWT avec le préfixe 'Bearer '. Exemple: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")));
    }
}
