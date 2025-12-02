package com.webelec.backend.dto;

import com.webelec.backend.model.Facture;
import com.webelec.backend.model.FactureLigne;
import com.webelec.backend.model.Client;
import com.webelec.backend.model.Societe;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class FactureResponseTest {
    @Test
    void from_maps_entity_to_response() {
        Societe societe = new Societe(); societe.setId(1L);
        Client client = new Client(); client.setId(2L);
        FactureLigne ligne = new FactureLigne();
        ligne.setId(10L);
        ligne.setDescription("desc");
        ligne.setQuantite(2);
        ligne.setPrixUnitaire(new BigDecimal("100.00"));
        ligne.setTotal(new BigDecimal("200.00"));
        Facture facture = new Facture();
        facture.setId(3L);
        facture.setNumero("FAC-1");
        facture.setDateEmission(LocalDate.of(2025, 2, 1));
        facture.setDateEcheance(LocalDate.of(2025, 2, 28));
        facture.setMontantHT(new BigDecimal("100.00"));
        facture.setMontantTVA(new BigDecimal("20.00"));
        facture.setMontantTTC(new BigDecimal("120.00"));
        facture.setStatut("SENT");
        facture.setSociete(societe);
        facture.setClient(client);
        facture.setLignes(List.of(ligne));
        FactureResponse dto = FactureResponse.from(facture);
        assertEquals(3L, dto.getId());
        assertEquals("FAC-1", dto.getNumero());
        assertEquals(LocalDate.of(2025, 2, 1), dto.getDateEmission());
        assertEquals(LocalDate.of(2025, 2, 28), dto.getDateEcheance());
        assertEquals(new BigDecimal("100.00"), dto.getMontantHT());
        assertEquals(new BigDecimal("20.00"), dto.getMontantTVA());
        assertEquals(new BigDecimal("120.00"), dto.getMontantTTC());
        assertEquals("SENT", dto.getStatut());
        assertEquals(1L, dto.getSocieteId());
        assertEquals(2L, dto.getClientId());
        assertEquals(1, dto.getLignes().size());
        FactureResponse.FactureLigneResponse l = dto.getLignes().get(0);
        assertEquals(10L, l.getId());
        assertEquals("desc", l.getDescription());
        assertEquals(2, l.getQuantite());
        assertEquals(new BigDecimal("100.00"), l.getPrixUnitaire());
        assertEquals(new BigDecimal("200.00"), l.getTotal());
    }
}
