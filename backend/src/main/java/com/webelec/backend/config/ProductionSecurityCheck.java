package com.webelec.backend.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * Validation de la configuration de sécurité en production.
 *
 * Cette classe vérifie que les paramètres de sécurité critiques sont correctement
 * configurés avant le démarrage de l'application en environnement de production.
 */
@Configuration
@Profile("prod")
public class ProductionSecurityCheck {

    private static final Logger log = LoggerFactory.getLogger(ProductionSecurityCheck.class);

    @Value("${webelec.security.jwt.secret}")
    private String jwtSecret;

    @Value("${cors.allowed-origins:NONE}")
    private String corsOrigins;

    /**
     * Valide la configuration de sécurité au démarrage de l'application.
     *
     * @throws IllegalStateException si la configuration est invalide
     */
    @PostConstruct
    public void validateSecurityConfig() {
        log.info("Validation de la configuration de sécurité en production...");

        // Vérification 1: Le secret JWT ne doit pas être celui par défaut
        if (jwtSecret.startsWith("dev-")) {
            throw new IllegalStateException(
                "ERREUR CRITIQUE: Le secret JWT par défaut est utilisé en production! " +
                "Définissez la variable d'environnement WEBELEC_JWT_SECRET avec une valeur sécurisée."
            );
        }

        // Vérification 2: Le secret doit avoir une longueur minimale (256 bits = 32 caractères)
        if (jwtSecret.length() < 32) {
            throw new IllegalStateException(
                "ERREUR CRITIQUE: Le secret JWT est trop court (minimum 32 caractères pour HMAC-SHA256). " +
                "Longueur actuelle: " + jwtSecret.length() + " caractères."
            );
        }

        // Vérification 3: CORS ne doit pas accepter toutes les origines
        if ("*".equals(corsOrigins) || corsOrigins.contains("*")) {
            log.warn(
                "AVERTISSEMENT: CORS configuré pour accepter toutes les origines (*). " +
                "Ceci est fortement déconseillé en production. " +
                "Définissez CORS_ALLOWED_ORIGINS avec des origines spécifiques."
            );
        }

        log.info("✓ Configuration de sécurité validée avec succès");
    }
}
