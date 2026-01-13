package com.webelec.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webelec.backend.config.TestSecurityConfig;
import com.webelec.backend.dto.ChantierRequest;
import com.webelec.backend.model.Chantier;
import com.webelec.backend.model.Societe;
import com.webelec.backend.model.Client;
import com.webelec.backend.service.ChantierService;
import com.webelec.backend.security.JwtAuthenticationFilter;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.context.annotation.Import;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ChantierController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(TestSecurityConfig.class)
class ChantierControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockitoBean
    private ChantierService service;
    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void createChantier_success() throws Exception {
        ChantierRequest req = new ChantierRequest();
        req.setNom("Chantier A");
        req.setAdresse("Adresse A");
        req.setDescription("Desc");
        req.setSocieteId(1L);
        req.setClientId(2L);
        Societe societe = Societe.builder().id(1L).nom("WebElec").build();
        Client client = Client.builder().id(2L).nom("Dupont").prenom("Marc").build();
        Chantier chantier = new Chantier(1L, "Chantier A", "Adresse A", "Desc", societe, client);
        Mockito.when(service.create(any(Chantier.class))).thenReturn(chantier);
        mockMvc.perform(post("/api/chantiers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nom").value("Chantier A"))
                .andExpect(jsonPath("$.client.id").value(2L));
    }

    @Test
    void createChantier_invalidJson_returns400() throws Exception {
        String invalidJson = "{\"nom\":\"\",\"adresse\":\"\",\"description\":\"\"}";
        mockMvc.perform(post("/api/chantiers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateChantier_success() throws Exception {
        ChantierRequest req = new ChantierRequest();
        req.setNom("Chantier B");
        req.setAdresse("Adresse B");
        req.setDescription("Desc2");
        req.setSocieteId(1L);
        req.setClientId(2L);
        Societe societe = Societe.builder().id(1L).nom("WebElec").build();
        Client client = Client.builder().id(2L).nom("Dupont").prenom("Marc").build();
        Chantier chantier = new Chantier(2L, "Chantier B", "Adresse B", "Desc2", societe, client);
        Mockito.when(service.update(Mockito.eq(2L), any(Chantier.class))).thenReturn(chantier);
        mockMvc.perform(put("/api/chantiers/2")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2L))
                .andExpect(jsonPath("$.nom").value("Chantier B"));
    }

    @Test
    void deleteChantier_success() throws Exception {
        Mockito.doNothing().when(service).delete(2L);
        mockMvc.perform(delete("/api/chantiers/2"))
                .andExpect(status().isNoContent());
    }

    @Test
    void createChantier_missingSocieteId_returns400() throws Exception {
        ChantierRequest req = new ChantierRequest();
        req.setNom("Chantier C");
        req.setAdresse("Adresse C");
        req.setDescription("DescC");
        // SocieteId manquant
        mockMvc.perform(post("/api/chantiers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createChantier_withRelations_success() throws Exception {
        ChantierRequest req = new ChantierRequest();
        req.setNom("Chantier D");
        req.setAdresse("Adresse D");
        req.setDescription("DescD");
        req.setSocieteId(1L);
        req.setClientId(2L);
        Societe societe = Societe.builder().id(1L).nom("WebElec").build();
        Client client = Client.builder().id(2L).nom("Dupont").prenom("Marc").build();
        Chantier chantier = new Chantier(3L, "Chantier D", "Adresse D", "DescD", societe, client);
        Mockito.when(service.create(any(Chantier.class))).thenReturn(chantier);
        mockMvc.perform(post("/api/chantiers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.societe.id").value(1L))
                .andExpect(jsonPath("$.client.id").value(2L));
    }

    // Ajoutez ici un test pour le cas de conflit/doublon si la logique existe (409)
}