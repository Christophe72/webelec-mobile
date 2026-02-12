package com.webelec.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webelec.backend.dto.PaiementRequest;
import com.webelec.backend.model.Client;
import com.webelec.backend.model.Facture;
import com.webelec.backend.model.Societe;
import com.webelec.backend.repository.ClientRepository;
import com.webelec.backend.repository.FactureRepository;
import com.webelec.backend.repository.PaiementRepository;
import com.webelec.backend.repository.SocieteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DisplayName("Tests d'intégration FactureController")
class FactureControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private FactureRepository factureRepository;

    @Autowired
    private SocieteRepository societeRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PaiementRepository paiementRepository;

    private Societe societe1;
    private Societe societe2;
    private Client client1;
    private Client client2;
    private Facture facture1;
    private Facture facture2;

    @BeforeEach
    void setUp() {
        paiementRepository.deleteAll();
        factureRepository.deleteAll();
        clientRepository.deleteAll();
        societeRepository.deleteAll();

        // Créer les sociétés
        societe1 = new Societe();
        societe1.setNom("Société Alpha");
        societe1 = societeRepository.save(societe1);

        societe2 = new Societe();
        societe2.setNom("Société Beta");
        societe2 = societeRepository.save(societe2);

        // Créer les clients
        client1 = new Client();
        client1.setNom("Dupont");
        client1.setPrenom("Jean");
        client1.setSociete(societe1);
        client1 = clientRepository.save(client1);

        client2 = new Client();
        client2.setNom("Martin");
        client2.setPrenom("Marie");
        client2.setSociete(societe2);
        client2 = clientRepository.save(client2);

        // Créer les factures
        facture1 = new Facture();
        facture1.setNumero("FAC-2026-001");
        facture1.setDateEmission(LocalDate.now());
        facture1.setDateEcheance(LocalDate.now().plusDays(30));
        facture1.setMontantHT(new BigDecimal("1000.00"));
        facture1.setMontantTVA(new BigDecimal("200.00"));
        facture1.setMontantTTC(new BigDecimal("1200.00"));
        facture1.setStatut("EN_ATTENTE");
        facture1.setSociete(societe1);
        facture1.setClient(client1);
        facture1 = factureRepository.save(facture1);

        facture2 = new Facture();
        facture2.setNumero("FAC-2026-002");
        facture2.setDateEmission(LocalDate.now());
        facture2.setDateEcheance(LocalDate.now().plusDays(30));
        facture2.setMontantHT(new BigDecimal("2000.00"));
        facture2.setMontantTVA(new BigDecimal("400.00"));
        facture2.setMontantTTC(new BigDecimal("2400.00"));
        facture2.setStatut("PAYEE");
        facture2.setSociete(societe2);
        facture2.setClient(client2);
        facture2 = factureRepository.save(facture2);
    }

    @Test
    @WithMockUser(roles = "ARTISAN")
    @DisplayName("GET /factures/societe/{id}/client/{id} - Double filtrage")
    void getBySocieteAndClient_Success() throws Exception {
        mockMvc.perform(get("/api/factures/societe/{societeId}/client/{clientId}",
                societe1.getId(), client1.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].numero").value("FAC-2026-001"))
                .andExpect(jsonPath("$[0].societeId").value(societe1.getId()))
                .andExpect(jsonPath("$[0].clientId").value(client1.getId()));
    }

    @Test
    @WithMockUser(roles = "ARTISAN")
    @DisplayName("GET /factures/societe/{id}/client/{id} - Aucune facture trouvée")
    void getBySocieteAndClient_NoResults() throws Exception {
        mockMvc.perform(get("/api/factures/societe/{societeId}/client/{clientId}",
                societe1.getId(), client2.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @WithMockUser(roles = "ARTISAN")
    @DisplayName("POST /factures/{id}/paiements - Créer un paiement")
    void createPaiement_Success() throws Exception {
        PaiementRequest request = new PaiementRequest(
                new BigDecimal("500.00"),
                LocalDate.now(),
                "VIREMENT",
                "PAY-TEST-001");

        mockMvc.perform(post("/api/factures/{id}/paiements", facture1.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.montant").value(500.00))
                .andExpect(jsonPath("$.mode").value("VIREMENT"))
                .andExpect(jsonPath("$.reference").value("PAY-TEST-001"))
                .andExpect(jsonPath("$.factureId").value(facture1.getId()));
    }

    @Test
    @WithMockUser(roles = "ARTISAN")
    @DisplayName("POST /factures/{id}/paiements - Montant négatif rejeté")
    void createPaiement_NegativeAmount_Rejected() throws Exception {
        PaiementRequest request = new PaiementRequest(
                new BigDecimal("-100.00"),
                LocalDate.now(),
                "ESPECES",
                "PAY-NEG");

        mockMvc.perform(post("/api/factures/{id}/paiements", facture1.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ARTISAN")
    @DisplayName("POST /factures/{id}/paiements - Facture inexistante")
    void createPaiement_FactureNotFound() throws Exception {
        PaiementRequest request = new PaiementRequest(
                new BigDecimal("500.00"),
                LocalDate.now(),
                "VIREMENT",
                "PAY-TEST");

        mockMvc.perform(post("/api/factures/{id}/paiements", 99999L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ARTISAN")
    @DisplayName("GET /factures/{id}/paiements - Récupérer les paiements d'une facture")
    void getPaiementsByFacture_Success() throws Exception {
        // Créer un paiement d'abord
        PaiementRequest request = new PaiementRequest(
                new BigDecimal("600.00"),
                LocalDate.now(),
                "CARTE",
                "PAY-CARTE-001");

        mockMvc.perform(post("/api/factures/{id}/paiements", facture1.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        // Récupérer les paiements
        mockMvc.perform(get("/api/factures/{id}/paiements", facture1.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].montant").value(600.00))
                .andExpect(jsonPath("$[0].mode").value("CARTE"));
    }

    @Test
    @WithMockUser(roles = "ARTISAN")
    @DisplayName("GET /factures/{id}/paiements - Facture sans paiements")
    void getPaiementsByFacture_Empty() throws Exception {
        mockMvc.perform(get("/api/factures/{id}/paiements", facture2.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @DisplayName("GET /factures/societe/{id}/client/{id} - Non authentifié")
    void getBySocieteAndClient_Unauthorized() throws Exception {
        mockMvc.perform(get("/api/factures/societe/{societeId}/client/{clientId}",
                societe1.getId(), client1.getId()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /factures/{id}/paiements - Non authentifié")
    void createPaiement_Unauthorized() throws Exception {
        PaiementRequest request = new PaiementRequest(
                new BigDecimal("500.00"),
                LocalDate.now(),
                "VIREMENT",
                "PAY-TEST");

        mockMvc.perform(post("/api/factures/{id}/paiements", facture1.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }
}
