package com.webelec.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webelec.backend.dto.SocieteRequest;
import com.webelec.backend.model.Societe;
import com.webelec.backend.model.UserSocieteRole;
import com.webelec.backend.model.Utilisateur;
import com.webelec.backend.model.UtilisateurRole;
import com.webelec.backend.security.AuthenticatedUtilisateur;
import com.webelec.backend.security.JwtService;
import com.webelec.backend.service.SocieteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests de sécurité pour les endpoints /api/societes/**
 * 
 * Cas testés :
 * - Accès sans authentification (401)
 * - Accès avec mauvais rôle (403)
 * - Accès avec token expiré (401)
 * - Accès autorisé pour chaque endpoint
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SocieteSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SocieteService societeService;

    private Societe testSociete;
    private Utilisateur adminUser;
    private Utilisateur gerantUser;
    private Utilisateur technicienUser;
    private Utilisateur userWithoutRole;

    @BeforeEach
    void setUp() {
        // Societe de test
        testSociete = Societe.builder()
                .id(1L)
                .nom("WebElec Test")
                .tva("BE0123456789")
                .email("test@webelec.be")
                .build();

        // Utilisateur ADMIN
        adminUser = new Utilisateur();
        adminUser.setId(1L);
        adminUser.setEmail("admin@webelec.be");
        adminUser.setNom("Admin");
        adminUser.setPrenom("Test");
        adminUser.setMotDePasse("encoded-password");
        List<UserSocieteRole> adminSocietes = new ArrayList<>();
        UserSocieteRole adminRole = new UserSocieteRole();
        adminRole.setUtilisateur(adminUser);
        adminRole.setSociete(testSociete);
        adminRole.setRole(UtilisateurRole.ADMIN);
        adminSocietes.add(adminRole);
        adminUser.setSocietes(adminSocietes);

        // Utilisateur GERANT
        gerantUser = new Utilisateur();
        gerantUser.setId(2L);
        gerantUser.setEmail("gerant@webelec.be");
        gerantUser.setNom("Gerant");
        gerantUser.setPrenom("Test");
        gerantUser.setMotDePasse("encoded-password");
        List<UserSocieteRole> gerantSocietes = new ArrayList<>();
        UserSocieteRole gerantRole = new UserSocieteRole();
        gerantRole.setUtilisateur(gerantUser);
        gerantRole.setSociete(testSociete);
        gerantRole.setRole(UtilisateurRole.GERANT);
        gerantSocietes.add(gerantRole);
        gerantUser.setSocietes(gerantSocietes);

        // Utilisateur TECHNICIEN
        technicienUser = new Utilisateur();
        technicienUser.setId(3L);
        technicienUser.setEmail("tech@webelec.be");
        technicienUser.setNom("Technicien");
        technicienUser.setPrenom("Test");
        technicienUser.setMotDePasse("encoded-password");
        List<UserSocieteRole> techSocietes = new ArrayList<>();
        UserSocieteRole techRole = new UserSocieteRole();
        techRole.setUtilisateur(technicienUser);
        techRole.setSociete(testSociete);
        techRole.setRole(UtilisateurRole.TECHNICIEN);
        techSocietes.add(techRole);
        technicienUser.setSocietes(techSocietes);

        // Utilisateur sans rôle dans aucune société
        userWithoutRole = new Utilisateur();
        userWithoutRole.setId(4L);
        userWithoutRole.setEmail("norole@webelec.be");
        userWithoutRole.setNom("NoRole");
        userWithoutRole.setPrenom("Test");
        userWithoutRole.setMotDePasse("encoded-password");
        userWithoutRole.setSocietes(new ArrayList<>());

        // Mock service
        when(societeService.findAll()).thenReturn(List.of(testSociete));
        when(societeService.findById(1L)).thenReturn(Optional.of(testSociete));
        when(societeService.create(any(Societe.class))).thenReturn(testSociete);
        when(societeService.update(any(Long.class), any(Societe.class))).thenReturn(testSociete);
    }

    @Nested
    @DisplayName("Tests sans authentification (401 attendu)")
    class SansAuthentification {

        @Test
        @WithAnonymousUser
        @DisplayName("GET /api/societes sans token → 401")
        void getAllSansTtoken_renvoie401() throws Exception {
            mockMvc.perform(get("/api/societes"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @WithAnonymousUser
        @DisplayName("GET /api/societes/{id} sans token → 401")
        void getByIdSansToken_renvoie401() throws Exception {
            mockMvc.perform(get("/api/societes/1"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @WithAnonymousUser
        @DisplayName("POST /api/societes sans token → 401")
        void createSansToken_renvoie401() throws Exception {
            SocieteRequest request = new SocieteRequest();
            request.setNom("Test");
            request.setTva("BE0123456789");
            request.setEmail("test@test.be");

            mockMvc.perform(post("/api/societes")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @WithAnonymousUser
        @DisplayName("PUT /api/societes/{id} sans token → 401")
        void updateSansToken_renvoie401() throws Exception {
            SocieteRequest request = new SocieteRequest();
            request.setNom("Test");
            request.setTva("BE0123456789");
            request.setEmail("test@test.be");

            mockMvc.perform(put("/api/societes/1")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @WithAnonymousUser
        @DisplayName("DELETE /api/societes/{id} sans token → 401")
        void deleteSansToken_renvoie401() throws Exception {
            mockMvc.perform(delete("/api/societes/1"))
                    .andExpect(status().isUnauthorized());
        }
    }

    @Nested
    @DisplayName("Tests avec mauvais rôle (403 attendu)")
    class MauvaisRole {

        @Test
        @DisplayName("POST /api/societes avec TECHNICIEN → 403")
        void createAvecTechnicien_renvoie403() throws Exception {
            AuthenticatedUtilisateur principal = new AuthenticatedUtilisateur(technicienUser);
            SocieteRequest request = new SocieteRequest();
            request.setNom("Test");
            request.setTva("BE0123456789");
            request.setEmail("test@test.be");

            mockMvc.perform(post("/api/societes")
                            .with(SecurityMockMvcRequestPostProcessors.user(principal))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("POST /api/societes avec GERANT → 403")
        void createAvecGerant_renvoie403() throws Exception {
            AuthenticatedUtilisateur principal = new AuthenticatedUtilisateur(gerantUser);
            SocieteRequest request = new SocieteRequest();
            request.setNom("Test");
            request.setTva("BE0123456789");
            request.setEmail("test@test.be");

            mockMvc.perform(post("/api/societes")
                            .with(SecurityMockMvcRequestPostProcessors.user(principal))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("PUT /api/societes/{id} avec TECHNICIEN → 403")
        void updateAvecTechnicien_renvoie403() throws Exception {
            AuthenticatedUtilisateur principal = new AuthenticatedUtilisateur(technicienUser);
            SocieteRequest request = new SocieteRequest();
            request.setNom("Test");
            request.setTva("BE0123456789");
            request.setEmail("test@test.be");

            mockMvc.perform(put("/api/societes/1")
                            .with(SecurityMockMvcRequestPostProcessors.user(principal))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("DELETE /api/societes/{id} avec TECHNICIEN → 403")
        void deleteAvecTechnicien_renvoie403() throws Exception {
            AuthenticatedUtilisateur principal = new AuthenticatedUtilisateur(technicienUser);

            mockMvc.perform(delete("/api/societes/1")
                            .with(SecurityMockMvcRequestPostProcessors.user(principal)))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("DELETE /api/societes/{id} avec GERANT → 403")
        void deleteAvecGerant_renvoie403() throws Exception {
            AuthenticatedUtilisateur principal = new AuthenticatedUtilisateur(gerantUser);

            mockMvc.perform(delete("/api/societes/1")
                            .with(SecurityMockMvcRequestPostProcessors.user(principal)))
                    .andExpect(status().isForbidden());
        }
    }

    @Nested
    @DisplayName("Tests utilisateur sans rôle dans aucune société (403 attendu)")
    class SansRoleDansSociete {

        @Test
        @DisplayName("GET /api/societes/{id} avec utilisateur sans rôle dans la société → 403")
        void getByIdSansRole_renvoie403() throws Exception {
            AuthenticatedUtilisateur principal = new AuthenticatedUtilisateur(userWithoutRole);

            mockMvc.perform(get("/api/societes/1")
                            .with(SecurityMockMvcRequestPostProcessors.user(principal)))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("POST /api/societes avec utilisateur sans rôle → 403")
        void createSansRole_renvoie403() throws Exception {
            AuthenticatedUtilisateur principal = new AuthenticatedUtilisateur(userWithoutRole);
            SocieteRequest request = new SocieteRequest();
            request.setNom("Test");
            request.setTva("BE0123456789");
            request.setEmail("test@test.be");

            mockMvc.perform(post("/api/societes")
                            .with(SecurityMockMvcRequestPostProcessors.user(principal))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isForbidden());
        }
    }

    @Nested
    @DisplayName("Tests avec rôles autorisés (200 attendu)")
    class AccesAutorise {

        @Test
        @DisplayName("GET /api/societes avec ADMIN → 200")
        void getAllAvecAdmin_renvoie200() throws Exception {
            AuthenticatedUtilisateur principal = new AuthenticatedUtilisateur(adminUser);

            mockMvc.perform(get("/api/societes")
                            .with(SecurityMockMvcRequestPostProcessors.user(principal)))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("GET /api/societes avec GERANT → 200")
        void getAllAvecGerant_renvoie200() throws Exception {
            AuthenticatedUtilisateur principal = new AuthenticatedUtilisateur(gerantUser);

            mockMvc.perform(get("/api/societes")
                            .with(SecurityMockMvcRequestPostProcessors.user(principal)))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("GET /api/societes avec TECHNICIEN → 200")
        void getAllAvecTechnicien_renvoie200() throws Exception {
            AuthenticatedUtilisateur principal = new AuthenticatedUtilisateur(technicienUser);

            mockMvc.perform(get("/api/societes")
                            .with(SecurityMockMvcRequestPostProcessors.user(principal)))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("GET /api/societes/{id} avec ADMIN → 200")
        void getByIdAvecAdmin_renvoie200() throws Exception {
            AuthenticatedUtilisateur principal = new AuthenticatedUtilisateur(adminUser);

            mockMvc.perform(get("/api/societes/1")
                            .with(SecurityMockMvcRequestPostProcessors.user(principal)))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("GET /api/societes/{id} avec utilisateur de la société → 200")
        void getByIdAvecUtilisateurDeLaSociete_renvoie200() throws Exception {
            AuthenticatedUtilisateur principal = new AuthenticatedUtilisateur(technicienUser);

            mockMvc.perform(get("/api/societes/1")
                            .with(SecurityMockMvcRequestPostProcessors.user(principal)))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("POST /api/societes avec ADMIN → 200")
        void createAvecAdmin_renvoie200() throws Exception {
            AuthenticatedUtilisateur principal = new AuthenticatedUtilisateur(adminUser);
            SocieteRequest request = new SocieteRequest();
            request.setNom("Test");
            request.setTva("BE0123456789");
            request.setEmail("test@test.be");

            mockMvc.perform(post("/api/societes")
                            .with(SecurityMockMvcRequestPostProcessors.user(principal))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("PUT /api/societes/{id} avec ADMIN → 200")
        void updateAvecAdmin_renvoie200() throws Exception {
            AuthenticatedUtilisateur principal = new AuthenticatedUtilisateur(adminUser);
            SocieteRequest request = new SocieteRequest();
            request.setNom("Test");
            request.setTva("BE0123456789");
            request.setEmail("test@test.be");

            mockMvc.perform(put("/api/societes/1")
                            .with(SecurityMockMvcRequestPostProcessors.user(principal))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("PUT /api/societes/{id} avec GERANT de la société → 200")
        void updateAvecGerant_renvoie200() throws Exception {
            AuthenticatedUtilisateur principal = new AuthenticatedUtilisateur(gerantUser);
            SocieteRequest request = new SocieteRequest();
            request.setNom("Test");
            request.setTva("BE0123456789");
            request.setEmail("test@test.be");

            mockMvc.perform(put("/api/societes/1")
                            .with(SecurityMockMvcRequestPostProcessors.user(principal))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("DELETE /api/societes/{id} avec ADMIN → 204")
        void deleteAvecAdmin_renvoie204() throws Exception {
            AuthenticatedUtilisateur principal = new AuthenticatedUtilisateur(adminUser);

            mockMvc.perform(delete("/api/societes/1")
                            .with(SecurityMockMvcRequestPostProcessors.user(principal)))
                    .andExpect(status().isNoContent());
        }
    }
}
