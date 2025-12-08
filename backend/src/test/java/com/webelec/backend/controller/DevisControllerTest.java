package com.webelec.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webelec.backend.config.TestSecurityConfig;
import com.webelec.backend.dto.DevisRequest;
import com.webelec.backend.model.Devis;
import com.webelec.backend.model.Societe;
import com.webelec.backend.model.Client;
import com.webelec.backend.service.DevisService;
import com.webelec.backend.security.JwtAuthenticationFilter;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DevisController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(TestSecurityConfig.class)
class DevisControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private DevisService service;
    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void createDevis_success() throws Exception {
        DevisRequest req = new DevisRequest();
        req.setNumero("DV-2025-001");
        req.setDateEmission(LocalDate.of(2025, 12, 2));
        req.setDateExpiration(LocalDate.of(2025, 12, 31));
        req.setMontantHT(new java.math.BigDecimal("1000.00"));
        req.setMontantTVA(new java.math.BigDecimal("210.00"));
        req.setMontantTTC(new java.math.BigDecimal("1210.00"));
        req.setStatut("EN_ATTENTE");
        req.setSocieteId(1L);
        req.setClientId(2L);
        
        // Ajout d'au moins une ligne valide
        com.webelec.backend.dto.DevisLigneRequest ligne = new com.webelec.backend.dto.DevisLigneRequest();
        ligne.setDescription("Test ligne");
        ligne.setQuantite(1);
        ligne.setPrixUnitaire(new java.math.BigDecimal("1000.00"));
        ligne.setTotal(new java.math.BigDecimal("1000.00"));
        req.setLignes(java.util.Collections.singletonList(ligne));
        
        Societe societe = Societe.builder().id(1L).nom("WebElec").build();
        Client client = Client.builder().id(2L).nom("Dupont").prenom("Marc").build();
        Devis devis = new Devis(1L, "DV-2025-001", LocalDate.of(2025, 12, 2), LocalDate.of(2025, 12, 31), new java.math.BigDecimal("1000.00"), new java.math.BigDecimal("210.00"), new java.math.BigDecimal("1210.00"), "EN_ATTENTE", societe, client);
        Mockito.when(service.create(any(Devis.class))).thenReturn(devis);
        mockMvc.perform(post("/api/devis")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.numero").value("DV-2025-001"));
    }

    @Test
    void createDevis_invalidJson_returns400() throws Exception {
        String invalidJson = "{\"numero\":\"\",\"dateEmission\":null,\"dateExpiration\":null,\"montantHT\":null,\"montantTVA\":null,\"montantTTC\":null,\"statut\":\"\",\"societeId\":null,\"clientId\":null,\"lignes\":[]}";
        mockMvc.perform(post("/api/devis")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateDevis_success() throws Exception {
        DevisRequest req = new DevisRequest();
        req.setNumero("DV-2025-002");
        req.setDateEmission(LocalDate.of(2025, 12, 3));
        req.setDateExpiration(LocalDate.of(2026, 1, 10));
        req.setMontantHT(new java.math.BigDecimal("2000.00"));
        req.setMontantTVA(new java.math.BigDecimal("420.00"));
        req.setMontantTTC(new java.math.BigDecimal("2420.00"));
        req.setStatut("VALIDE");
        req.setSocieteId(1L);
        req.setClientId(2L);
        
        // Ajout d'au moins une ligne valide
        com.webelec.backend.dto.DevisLigneRequest ligne = new com.webelec.backend.dto.DevisLigneRequest();
        ligne.setDescription("Test ligne mise à jour");
        ligne.setQuantite(2);
        ligne.setPrixUnitaire(new java.math.BigDecimal("1000.00"));
        ligne.setTotal(new java.math.BigDecimal("2000.00"));
        req.setLignes(java.util.Collections.singletonList(ligne));
        
        Societe societe = Societe.builder().id(1L).nom("WebElec").build();
        Client client = Client.builder().id(2L).nom("Dupont").prenom("Marc").build();
        Devis devis = new Devis(2L, "DV-2025-002", LocalDate.of(2025, 12, 3), LocalDate.of(2026, 1, 10), new java.math.BigDecimal("2000.00"), new java.math.BigDecimal("420.00"), new java.math.BigDecimal("2420.00"), "VALIDE", societe, client);
        Mockito.when(service.update(Mockito.eq(2L), any(Devis.class))).thenReturn(devis);
        mockMvc.perform(put("/api/devis/2")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2L))
                .andExpect(jsonPath("$.numero").value("DV-2025-002"));
    }

    @Test
    void deleteDevis_success() throws Exception {
        Mockito.doNothing().when(service).delete(2L);
        mockMvc.perform(delete("/api/devis/2"))
                .andExpect(status().isNoContent());
    }

    // Ajoutez ici un test pour le cas de conflit/doublon si la logique existe (409)
}