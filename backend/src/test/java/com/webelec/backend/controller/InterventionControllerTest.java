package com.webelec.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webelec.backend.config.TestSecurityConfig;
import com.webelec.backend.dto.InterventionRequest;
import com.webelec.backend.model.Intervention;
import com.webelec.backend.model.Societe;
import com.webelec.backend.model.Chantier;
import com.webelec.backend.model.Client;
import com.webelec.backend.model.Utilisateur;
import com.webelec.backend.model.UtilisateurRole;
import com.webelec.backend.service.InterventionService;
import com.webelec.backend.security.JwtAuthenticationFilter;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static com.webelec.backend.util.MockitoNonNull.anyNonNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(InterventionController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(TestSecurityConfig.class)
class InterventionControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockitoBean
    private InterventionService service;
    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void createIntervention_success() throws Exception {
        InterventionRequest req = new InterventionRequest();
        req.setTitre("Interv");
        req.setDescription("Desc");
        req.setDateIntervention(LocalDate.of(2025, 12, 2));
        req.setSocieteId(1L);
        req.setChantierId(2L);
        req.setClientId(3L);
        req.setUtilisateurId(4L);
        Societe societe = Societe.builder().id(1L).nom("WebElec").build();
        Chantier chantier = new Chantier(); chantier.setId(2L); chantier.setNom("Garage");
        Client client = Client.builder().id(3L).nom("Dupont").prenom("Marc").build();
        Utilisateur utilisateur = new Utilisateur(); utilisateur.setId(4L); utilisateur.setNom("Tech"); utilisateur.setPrenom("Alex"); utilisateur.setRole(UtilisateurRole.TECHNICIEN);
        Intervention intervention = new Intervention();
        intervention.setId(5L);
        intervention.setTitre("Interv");
        intervention.setDescription("Desc");
        intervention.setDateIntervention(LocalDate.of(2025, 12, 2));
        intervention.setSociete(societe);
        intervention.setChantier(chantier);
        intervention.setClient(client);
        intervention.setUtilisateur(utilisateur);
        Mockito.when(service.create(anyNonNull(Intervention.class))).thenReturn(intervention);
        mockMvc.perform(post("/api/interventions")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(5L))
                .andExpect(jsonPath("$.titre").value("Interv"));
    }

    @Test
    void createIntervention_invalidJson_returns400() throws Exception {
        String invalidJson = "{\"titre\":\"\",\"description\":\"\"}";
        mockMvc.perform(post("/api/interventions")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateIntervention_success() throws Exception {
        InterventionRequest req = new InterventionRequest();
        req.setTitre("Interv2");
        req.setDescription("Desc2");
        req.setDateIntervention(LocalDate.of(2025, 12, 3));
        req.setSocieteId(1L);
        req.setChantierId(2L);
        req.setClientId(3L);
        req.setUtilisateurId(4L);
        Intervention intervention = new Intervention();
        intervention.setId(6L);
        intervention.setTitre("Interv2");
        intervention.setDescription("Desc2");
        intervention.setDateIntervention(LocalDate.of(2025, 12, 3));
        Mockito.when(service.update(Mockito.eq(6L), anyNonNull(Intervention.class))).thenReturn(intervention);
        mockMvc.perform(put("/api/interventions/6")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(6L))
                .andExpect(jsonPath("$.titre").value("Interv2"));
    }

    @Test
    void deleteIntervention_success() throws Exception {
        Mockito.doNothing().when(service).delete(6L);
        mockMvc.perform(delete("/api/interventions/6"))
                .andExpect(status().isNoContent());
    }

    // Ajoutez ici un test pour le cas de conflit/doublon si la logique existe (409)
}