package com.webelec.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webelec.backend.config.TestSecurityConfig;
import com.webelec.backend.dto.UtilisateurRequest;
import com.webelec.backend.repository.UtilisateurRepository;
import com.webelec.backend.service.UtilisateurService;
import com.webelec.backend.security.JwtService;
import com.webelec.backend.security.UtilisateurDetailsService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static com.webelec.backend.util.MockitoNonNull.anyNonNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@WebMvcTest(UtilisateurController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
@Import(TestSecurityConfig.class)
class UtilisateurControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UtilisateurService service;

    @MockitoBean
    private UtilisateurRepository utilisateurRepository;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UtilisateurDetailsService utilisateurDetailsService;

    @Test
    void createUtilisateur_conflict_returns409() throws Exception {
        UtilisateurRequest req = new UtilisateurRequest();
        req.setNom("Dupont");
        req.setPrenom("Marc");
        req.setEmail("marc@webelec.com");
        req.setMotDePasse("secret123");
        req.setRole("ADMIN");
        req.setSocieteId(1L);

        Mockito.when(service.create(anyNonNull(UtilisateurRequest.class)))
               .thenThrow(new IllegalStateException("Email déjà utilisé"));

        mockMvc.perform(post("/api/utilisateurs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Email déjà utilisé"));
    }
}