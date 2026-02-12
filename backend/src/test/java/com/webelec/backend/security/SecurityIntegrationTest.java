package com.webelec.backend.security;

import com.webelec.backend.config.JwtProperties;
import com.webelec.backend.model.Client;
import com.webelec.backend.model.Societe;
import com.webelec.backend.model.Utilisateur;
import com.webelec.backend.model.UtilisateurRole;
import com.webelec.backend.repository.ClientRepository;
import com.webelec.backend.repository.SocieteRepository;
import com.webelec.backend.repository.UtilisateurRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
@DisplayName("Tests d'intégration de sécurité - RBAC et endpoints")
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private SocieteRepository societeRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Societe societe;
    private Utilisateur artisan;
    private Utilisateur tech;
    private Utilisateur auditeur;
    private String artisanToken;
    private String techToken;
    private String auditeurToken;

    @BeforeEach
    void setUp() {
        // Nettoyer les données
        clientRepository.deleteAll();
        utilisateurRepository.deleteAll();
        societeRepository.deleteAll();

        // Créer une société
        societe = new Societe();
        societe.setNom("Test Company");
        societe.setTva("FR12345678900");
        societe = societeRepository.save(societe);

        // Créer un utilisateur ARTISAN
        artisan = new Utilisateur();
        artisan.setEmail("artisan@test.com");
        artisan.setMotDePasse(passwordEncoder.encode("password"));
        artisan.setRole(UtilisateurRole.ARTISAN);
        artisan.setSociete(societe);
        artisan = utilisateurRepository.save(artisan);
        artisanToken = jwtService.generateAccessToken(artisan);

        // Créer un utilisateur TECH
        tech = new Utilisateur();
        tech.setEmail("tech@test.com");
        tech.setMotDePasse(passwordEncoder.encode("password"));
        tech.setRole(UtilisateurRole.TECH);
        tech.setSociete(societe);
        tech = utilisateurRepository.save(tech);
        techToken = jwtService.generateAccessToken(tech);

        // Créer un utilisateur AUDITEUR
        auditeur = new Utilisateur();
        auditeur.setEmail("auditeur@test.com");
        auditeur.setMotDePasse(passwordEncoder.encode("password"));
        auditeur.setRole(UtilisateurRole.AUDITEUR);
        auditeur.setSociete(societe);
        auditeur = utilisateurRepository.save(auditeur);
        auditeurToken = jwtService.generateAccessToken(auditeur);
    }

    @Test
    @DisplayName("Endpoints publics /api/auth/* accessibles sans authentification")
    void publicEndpoints_NoAuth_Returns200Or400() throws Exception {
        // /api/auth/login devrait retourner 400 (bad request) sans body, pas 401
        mockMvc.perform(post("/api/auth/login"))
            .andExpect(status().isBadRequest());

        // /api/auth/register devrait retourner 400 (bad request) sans body, pas 401
        mockMvc.perform(post("/api/auth/register"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Endpoints protégés - Requête sans token renvoie 401")
    void protectedEndpoints_NoToken_Returns401() throws Exception {
        mockMvc.perform(get("/api/clients"))
            .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/factures"))
            .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/chantiers"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Endpoints protégés - Token invalide renvoie 401")
    void protectedEndpoints_InvalidToken_Returns401() throws Exception {
        mockMvc.perform(get("/api/clients")
                .header(HttpHeaders.AUTHORIZATION, "Bearer invalid.token.here"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Endpoints protégés - Token malformé (sans Bearer) renvoie 401")
    void protectedEndpoints_MalformedToken_Returns401() throws Exception {
        mockMvc.perform(get("/api/clients")
                .header(HttpHeaders.AUTHORIZATION, artisanToken))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("ROLE_ARTISAN - Accès autorisé aux endpoints /api/clients")
    void artisanRole_AccessClients_Returns200() throws Exception {
        mockMvc.perform(get("/api/clients")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + artisanToken))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("ROLE_ARTISAN - Accès autorisé aux endpoints /api/catalogue")
    void artisanRole_AccessCatalogue_Returns200() throws Exception {
        mockMvc.perform(get("/api/catalogue")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + artisanToken))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("ROLE_ARTISAN - Accès autorisé aux endpoints /api/devis")
    void artisanRole_AccessDevis_Returns200() throws Exception {
        mockMvc.perform(get("/api/devis")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + artisanToken))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("ROLE_ARTISAN - Accès autorisé aux endpoints /api/chantiers")
    void artisanRole_AccessChantiers_Returns200() throws Exception {
        mockMvc.perform(get("/api/chantiers")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + artisanToken))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("ROLE_TECH - Accès refusé aux endpoints /api/clients (ARTISAN only)")
    void techRole_AccessClients_Returns403() throws Exception {
        mockMvc.perform(get("/api/clients")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + techToken))
            .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("ROLE_TECH - Accès autorisé aux endpoints /api/chantiers")
    void techRole_AccessChantiers_Returns200() throws Exception {
        mockMvc.perform(get("/api/chantiers")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + techToken))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("ROLE_TECH - Accès autorisé aux endpoints /api/rgie")
    void techRole_AccessRgie_Returns200Or404() throws Exception {
        // Peut retourner 404 si aucune donnée, mais pas 403 (forbidden)
        var result = mockMvc.perform(get("/api/rgie")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + techToken))
            .andReturn();

        int status = result.getResponse().getStatus();
        assertThat(status).isNotEqualTo(403);
    }

    @Test
    @DisplayName("ROLE_AUDITEUR - Accès refusé aux endpoints /api/clients (ARTISAN only)")
    void auditeurRole_AccessClients_Returns403() throws Exception {
        mockMvc.perform(get("/api/clients")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + auditeurToken))
            .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("ROLE_AUDITEUR - Accès autorisé aux endpoints /api/chantiers")
    void auditeurRole_AccessChantiers_Returns200() throws Exception {
        mockMvc.perform(get("/api/chantiers")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + auditeurToken))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("ROLE_AUDITEUR - Accès autorisé aux endpoints /api/rgie")
    void auditeurRole_AccessRgie_Returns200Or404() throws Exception {
        var result = mockMvc.perform(get("/api/rgie")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + auditeurToken))
            .andReturn();

        int status = result.getResponse().getStatus();
        assertThat(status).isNotEqualTo(403);
    }

    @Test
    @DisplayName("Token expiré - Accès refusé")
    void expiredToken_Returns401() throws Exception {
        // Créer un service JWT avec expiration immédiate
        JwtProperties shortProperties = new JwtProperties();
        shortProperties.setSecret("test-secret-key-for-jwt-signing-minimum-256-bits-required-for-hmac-sha256");
        shortProperties.setAccessTokenValidity(java.time.Duration.ofMillis(1));
        shortProperties.setRefreshTokenValidity(java.time.Duration.ofDays(7));
        shortProperties.setIssuer("webelec-test");

        JwtService shortJwtService = new JwtService(shortProperties);
        String expiredToken = shortJwtService.generateAccessToken(artisan);

        // Attendre que le token expire
        Thread.sleep(50);

        mockMvc.perform(get("/api/clients")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + expiredToken))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Header Authorization avec espace supplémentaire - Token extrait correctement")
    void authorizationHeader_ExtraSpaces_WorksCorrectly() throws Exception {
        mockMvc.perform(get("/api/clients")
                .header(HttpHeaders.AUTHORIZATION, "Bearer  " + artisanToken)) // Double espace
            .andExpect(status().isUnauthorized()); // Devrait échouer car le token commence par un espace
    }

    @Test
    @DisplayName("Plusieurs requêtes avec le même token - Toutes authentifiées")
    void sameToken_MultipleRequests_AllAuthenticated() throws Exception {
        // Première requête
        mockMvc.perform(get("/api/clients")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + artisanToken))
            .andExpect(status().isOk());

        // Deuxième requête avec le même token
        mockMvc.perform(get("/api/devis")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + artisanToken))
            .andExpect(status().isOk());

        // Troisième requête avec le même token
        mockMvc.perform(get("/api/catalogue")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + artisanToken))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Token d'un utilisateur différent - Accès refusé aux ressources privées")
    void differentUserToken_AccessPrivateResources_Returns403OrFiltered() throws Exception {
        // Créer un client pour l'artisan
        Client client = new Client();
        client.setNom("Test Client");
        client.setPrenom("Test");
        client.setSociete(societe);
        client = clientRepository.save(client);

        // L'utilisateur TECH ne devrait pas pouvoir accéder aux clients
        mockMvc.perform(get("/api/clients")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + techToken))
            .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Vérification CORS - OPTIONS request sur endpoint protégé")
    void corsPreflightRequest_Returns200() throws Exception {
        mockMvc.perform(options("/api/clients")
                .header(HttpHeaders.ORIGIN, "http://localhost:3000")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET"))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Headers de sécurité présents dans la réponse")
    void securityHeaders_PresentInResponse() throws Exception {
        mockMvc.perform(get("/api/clients")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + artisanToken))
            .andExpect(header().exists("X-Content-Type-Options"))
            .andExpect(header().exists("X-Frame-Options"))
            .andExpect(header().exists("X-XSS-Protection"));
    }

    @Test
    @DisplayName("Session stateless - Pas de cookie JSESSIONID")
    void statelessSession_NoSessionCookie() throws Exception {
        var result = mockMvc.perform(get("/api/clients")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + artisanToken))
            .andExpect(status().isOk())
            .andReturn();

        var cookies = result.getResponse().getCookies();
        for (var cookie : cookies) {
            assertThat(cookie.getName()).isNotEqualTo("JSESSIONID");
        }
    }

    @Test
    @DisplayName("Token avec caractères spéciaux dans le payload - Fonctionne correctement")
    void tokenWithSpecialCharacters_WorksCorrectly() throws Exception {
        // Créer un utilisateur avec un email contenant des caractères spéciaux
        Utilisateur specialUser = new Utilisateur();
        specialUser.setEmail("test+special@example.com");
        specialUser.setMotDePasse(passwordEncoder.encode("password"));
        specialUser.setRole(UtilisateurRole.ARTISAN);
        specialUser.setSociete(societe);
        specialUser = utilisateurRepository.save(specialUser);

        String specialToken = jwtService.generateAccessToken(specialUser);

        mockMvc.perform(get("/api/clients")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + specialToken))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Endpoint inexistant avec token valide - Retourne 404")
    void nonExistentEndpoint_ValidToken_Returns404() throws Exception {
        mockMvc.perform(get("/api/this-endpoint-does-not-exist")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + artisanToken))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Méthode HTTP non autorisée - Retourne 405")
    void methodNotAllowed_ValidToken_Returns405() throws Exception {
        // Supposant que PATCH n'est pas implémenté sur /api/clients
        mockMvc.perform(patch("/api/clients/1")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + artisanToken))
            .andExpect(status().isMethodNotAllowed());
    }
}
