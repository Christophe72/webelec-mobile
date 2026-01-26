package com.webelec.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webelec.backend.config.TestSecurityConfig;
import com.webelec.backend.dto.SocieteRequest;
import com.webelec.backend.model.Societe;
import com.webelec.backend.security.JwtAuthenticationFilter;
import com.webelec.backend.security.JwtService;
import com.webelec.backend.security.SocieteSecurityService;
import com.webelec.backend.security.UtilisateurDetailsService;
import com.webelec.backend.service.SocieteService;
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

@WebMvcTest(SocieteController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
@Import(TestSecurityConfig.class)
class SocieteControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockitoBean
    private SocieteService service;
    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private SocieteSecurityService societeSecurityService;

    @MockitoBean
    private UtilisateurDetailsService utilisateurDetailsService;

    @Test
    void createSociete_success() throws Exception {
        SocieteRequest req = new SocieteRequest();
        req.setNom("WebElec");
        req.setTva("BE123456789");
        req.setEmail("contact@webelec.com");
        Societe societe = Societe.builder().id(1L).nom("WebElec").tva("BE123456789").email("contact@webelec.com").build();
        Mockito.when(service.create(anyNonNull(Societe.class))).thenReturn(societe);
        mockMvc.perform(post("/api/societes")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nom").value("WebElec"));
    }

    @Test
    void createSociete_invalidJson_returns400() throws Exception {
        String invalidJson = "{\"nom\":\"\",\"tva\":\"\",\"email\":\"not-an-email\"}";
        mockMvc.perform(post("/api/societes")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createSociete_conflict_returns409() throws Exception {
        SocieteRequest req = new SocieteRequest();
        req.setNom("WebElec");
        req.setTva("BE123456789");
        req.setEmail("contact@webelec.com");
        Mockito.when(service.create(anyNonNull(Societe.class))).thenThrow(new IllegalStateException("Email déjà utilisé"));
        mockMvc.perform(post("/api/societes")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Email déjà utilisé"));
    }
}