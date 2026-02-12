package com.webelec.backend.security;

import com.webelec.backend.config.JwtProperties;
import com.webelec.backend.model.Societe;
import com.webelec.backend.model.Utilisateur;
import com.webelec.backend.model.UtilisateurRole;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.time.Instant;

import static org.assertj.core.api.Assertions.*;

@DisplayName("Tests de sécurité JWT - JwtService")
class JwtServiceTest {

    private JwtService jwtService;
    private Utilisateur utilisateur;
    private JwtProperties properties;

    @BeforeEach
    void setUp() {
        // Configuration JWT pour les tests (durées courtes)
        properties = new JwtProperties();
        properties.setSecret("test-secret-key-for-jwt-signing-minimum-256-bits-required-for-hmac-sha256");
        properties.setAccessTokenValidity(Duration.ofMinutes(15));
        properties.setRefreshTokenValidity(Duration.ofDays(7));
        properties.setIssuer("webelec-test");

        jwtService = new JwtService(properties);

        // Créer un utilisateur de test
        Societe societe = new Societe();
        societe.setId(1L);
        societe.setNom("Test Company");

        utilisateur = new Utilisateur();
        utilisateur.setId(123L);
        utilisateur.setEmail("test@example.com");
        utilisateur.setRole(UtilisateurRole.ARTISAN);
        utilisateur.setSociete(societe);
    }

    @Test
    @DisplayName("Génération d'un access token valide")
    void generateAccessToken_Success() {
        String token = jwtService.generateAccessToken(utilisateur);

        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
        assertThat(token.split("\\.")).hasSize(3); // header.payload.signature
    }

    @Test
    @DisplayName("Génération d'un refresh token valide")
    void generateRefreshToken_Success() {
        String token = jwtService.generateRefreshToken(utilisateur);

        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
        assertThat(token.split("\\.")).hasSize(3);
    }

    @Test
    @DisplayName("Extraction du username depuis le token")
    void extractUsername_Success() {
        String token = jwtService.generateAccessToken(utilisateur);

        String username = jwtService.extractUsername(token);

        assertThat(username).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("Extraction de l'expiration depuis le token")
    void extractExpiration_Success() {
        String token = jwtService.generateAccessToken(utilisateur);

        Instant expiration = jwtService.extractExpiration(token);

        assertThat(expiration).isAfter(Instant.now());
        assertThat(expiration).isBefore(Instant.now().plus(Duration.ofMinutes(20)));
    }

    @Test
    @DisplayName("Extraction des claims personnalisés - UID")
    void extractCustomClaim_Uid_Success() {
        String token = jwtService.generateAccessToken(utilisateur);

        Long uid = jwtService.extractClaim(token, claims -> claims.get("uid", Long.class));

        assertThat(uid).isEqualTo(123L);
    }

    @Test
    @DisplayName("Extraction des claims personnalisés - Role")
    void extractCustomClaim_Role_Success() {
        String token = jwtService.generateAccessToken(utilisateur);

        String role = jwtService.extractClaim(token, claims -> claims.get("role", String.class));

        assertThat(role).isEqualTo("ROLE_ARTISAN");
    }

    @Test
    @DisplayName("Extraction des claims personnalisés - SocieteId")
    void extractCustomClaim_SocieteId_Success() {
        String token = jwtService.generateAccessToken(utilisateur);

        Long societeId = jwtService.extractClaim(token, claims -> claims.get("societeId", Long.class));

        assertThat(societeId).isEqualTo(1L);
    }

    @Test
    @DisplayName("Validation d'un token valide")
    void isTokenValid_ValidToken_ReturnsTrue() {
        String token = jwtService.generateAccessToken(utilisateur);

        boolean isValid = jwtService.isTokenValid(token, utilisateur);

        assertThat(isValid).isTrue();
    }

    @Test
    @DisplayName("Validation échoue si le token appartient à un autre utilisateur")
    void isTokenValid_DifferentUser_ReturnsFalse() {
        String token = jwtService.generateAccessToken(utilisateur);

        Utilisateur autreUtilisateur = new Utilisateur();
        autreUtilisateur.setId(456L);
        autreUtilisateur.setEmail("autre@example.com");

        boolean isValid = jwtService.isTokenValid(token, autreUtilisateur);

        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("Validation échoue pour un token expiré")
    void isTokenValid_ExpiredToken_ReturnsFalse() {
        // Créer un service JWT avec une durée de validité très courte
        JwtProperties shortProperties = new JwtProperties();
        shortProperties.setSecret("test-secret-key-for-jwt-signing-minimum-256-bits-required-for-hmac-sha256");
        shortProperties.setAccessTokenValidity(Duration.ofMillis(1)); // 1 milliseconde
        shortProperties.setRefreshTokenValidity(Duration.ofDays(7));
        shortProperties.setIssuer("webelec-test");

        JwtService shortJwtService = new JwtService(shortProperties);
        String token = shortJwtService.generateAccessToken(utilisateur);

        // Attendre que le token expire
        try {
            Thread.sleep(50);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        boolean isValid = shortJwtService.isTokenValid(token, utilisateur);

        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("Extraction échoue pour un token malformé")
    void extractUsername_MalformedToken_ThrowsException() {
        String malformedToken = "not.a.valid.jwt.token";

        assertThatThrownBy(() -> jwtService.extractUsername(malformedToken))
            .isInstanceOf(JwtException.class);
    }

    @Test
    @DisplayName("Extraction échoue pour un token avec signature invalide")
    void extractUsername_InvalidSignature_ThrowsException() {
        String token = jwtService.generateAccessToken(utilisateur);

        // Modifier légèrement le token pour invalider la signature
        String tamperedToken = token.substring(0, token.length() - 5) + "XXXXX";

        assertThatThrownBy(() -> jwtService.extractUsername(tamperedToken))
            .isInstanceOf(JwtException.class);
    }

    @Test
    @DisplayName("Extraction échoue pour un token vide")
    void extractUsername_EmptyToken_ThrowsException() {
        assertThatThrownBy(() -> jwtService.extractUsername(""))
            .isInstanceOf(JwtException.class);
    }

    @Test
    @DisplayName("Extraction échoue pour un token null")
    void extractUsername_NullToken_ThrowsException() {
        assertThatThrownBy(() -> jwtService.extractUsername(null))
            .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("Token généré contient l'issuer configuré")
    void generateToken_ContainsCorrectIssuer() {
        String token = jwtService.generateAccessToken(utilisateur);

        String issuer = jwtService.extractClaim(token, claims -> claims.getIssuer());

        assertThat(issuer).isEqualTo("webelec-test");
    }

    @Test
    @DisplayName("Token généré contient le subject (email)")
    void generateToken_ContainsCorrectSubject() {
        String token = jwtService.generateAccessToken(utilisateur);

        String subject = jwtService.extractClaim(token, claims -> claims.getSubject());

        assertThat(subject).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("Access token et refresh token ont des durées différentes")
    void accessAndRefreshTokens_HaveDifferentExpirations() {
        String accessToken = jwtService.generateAccessToken(utilisateur);
        String refreshToken = jwtService.generateRefreshToken(utilisateur);

        Instant accessExpiration = jwtService.extractExpiration(accessToken);
        Instant refreshExpiration = jwtService.extractExpiration(refreshToken);

        // Le refresh token doit expirer après l'access token
        assertThat(refreshExpiration).isAfter(accessExpiration);

        // Vérifier les durées approximatives
        assertThat(accessExpiration).isBefore(Instant.now().plus(Duration.ofMinutes(20)));
        assertThat(refreshExpiration).isAfter(Instant.now().plus(Duration.ofDays(6)));
    }

    @Test
    @DisplayName("Token pour utilisateur sans rôle ne contient pas le claim role")
    void generateToken_UserWithoutRole_NoRoleClaim() {
        utilisateur.setRole(null);

        String token = jwtService.generateAccessToken(utilisateur);

        String role = jwtService.extractClaim(token, claims -> claims.get("role", String.class));

        assertThat(role).isNull();
    }

    @Test
    @DisplayName("Token pour utilisateur sans société ne contient pas le claim societeId")
    void generateToken_UserWithoutSociete_NoSocieteIdClaim() {
        utilisateur.setSociete(null);

        String token = jwtService.generateAccessToken(utilisateur);

        Long societeId = jwtService.extractClaim(token, claims -> claims.get("societeId", Long.class));

        assertThat(societeId).isNull();
    }

    @Test
    @DisplayName("Extraction de l'expiration d'un token expiré réussit")
    void extractExpiration_ExpiredToken_Success() {
        // Créer un service JWT avec une durée de validité très courte
        JwtProperties shortProperties = new JwtProperties();
        shortProperties.setSecret("test-secret-key-for-jwt-signing-minimum-256-bits-required-for-hmac-sha256");
        shortProperties.setAccessTokenValidity(Duration.ofMillis(1));
        shortProperties.setRefreshTokenValidity(Duration.ofDays(7));
        shortProperties.setIssuer("webelec-test");

        JwtService shortJwtService = new JwtService(shortProperties);
        String token = shortJwtService.generateAccessToken(utilisateur);

        // Attendre que le token expire
        try {
            Thread.sleep(50);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // L'extraction de l'expiration devrait réussir même pour un token expiré
        // car elle ne vérifie que la structure et la signature, pas l'expiration
        Instant expiration = shortJwtService.extractExpiration(token);

        assertThat(expiration).isBefore(Instant.now());
    }

    @Test
    @DisplayName("Validation échoue pour un token null")
    void isTokenValid_NullToken_ThrowsException() {
        assertThatThrownBy(() -> jwtService.isTokenValid(null, utilisateur))
            .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("Token généré pour différents utilisateurs produit des tokens différents")
    void generateToken_DifferentUsers_ProduceDifferentTokens() {
        Utilisateur utilisateur2 = new Utilisateur();
        utilisateur2.setId(456L);
        utilisateur2.setEmail("autre@example.com");
        utilisateur2.setRole(UtilisateurRole.TECH);

        String token1 = jwtService.generateAccessToken(utilisateur);
        String token2 = jwtService.generateAccessToken(utilisateur2);

        assertThat(token1).isNotEqualTo(token2);
    }

    @Test
    @DisplayName("Token généré deux fois pour le même utilisateur produit des tokens différents")
    void generateToken_SameUserTwice_ProducesDifferentTokens() {
        String token1 = jwtService.generateAccessToken(utilisateur);

        // Attendre un peu pour que le timestamp change
        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        String token2 = jwtService.generateAccessToken(utilisateur);

        assertThat(token1).isNotEqualTo(token2);
    }

    @Test
    @DisplayName("Token contient la date d'émission (issuedAt)")
    void generateToken_ContainsIssuedAt() {
        Instant beforeGeneration = Instant.now().minusSeconds(1);

        String token = jwtService.generateAccessToken(utilisateur);

        Instant afterGeneration = Instant.now().plusSeconds(1);
        Instant issuedAt = jwtService.extractClaim(token, claims -> claims.getIssuedAt().toInstant());

        assertThat(issuedAt).isBetween(beforeGeneration, afterGeneration);
    }
}
