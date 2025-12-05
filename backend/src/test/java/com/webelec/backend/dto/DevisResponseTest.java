package com.webelec.backend.dto;

import com.webelec.backend.model.Devis;
import com.webelec.backend.model.DevisLigne;
import com.webelec.backend.model.Client;
import com.webelec.backend.model.Societe;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class DevisResponseTest {
    @Test
    void from_maps_entity_to_response() {
        Societe societe = new Societe(); societe.setId(1L);
        Client client = new Client(); client.setId(2L);
        DevisLigne ligne = new DevisLigne();
        ligne.setId(10L);
        ligne.setDescription("desc");
        ligne.setQuantite(2);
        ligne.setPrixUnitaire(new BigDecimal("100.00"));
        ligne.setTotal(new BigDecimal("200.00"));
        Devis devis = new Devis();
        devis.setId(3L);
        devis.setNumero("DEV-1");
        devis.setDateEmission(LocalDate.of(2025, 1, 1));
        devis.setDateExpiration(LocalDate.of(2025, 1, 31));
        devis.setMontantHT(new BigDecimal("100.00"));
        devis.setMontantTVA(new BigDecimal("20.00"));
        devis.setMontantTTC(new BigDecimal("120.00"));
        devis.setStatut("DRAFT");
        devis.setSociete(societe);
        devis.setClient(client);
        devis.setLignes(List.of(ligne));
        DevisResponse dto = DevisResponse.from(devis);
        assertEquals(3L, dto.getId());
        assertEquals("DEV-1", dto.getNumero());
        assertEquals(LocalDate.of(2025, 1, 1), dto.getDateEmission());
        assertEquals(LocalDate.of(2025, 1, 31), dto.getDateExpiration());
        assertEquals(new BigDecimal("100.00"), dto.getMontantHT());
        assertEquals(new BigDecimal("20.00"), dto.getMontantTVA());
        assertEquals(new BigDecimal("120.00"), dto.getMontantTTC());
        assertEquals("DRAFT", dto.getStatut());
        assertEquals(1L, dto.getSocieteId());
        assertEquals(2L, dto.getClientId());
        assertEquals(1, dto.getLignes().size());
        DevisResponse.DevisLigneResponse l = dto.getLignes().get(0);
        assertEquals(10L, l.getId());
        assertEquals("desc", l.getDescription());
        assertEquals(2, l.getQuantite());
        assertEquals(new BigDecimal("100.00"), l.getPrixUnitaire());
        assertEquals(new BigDecimal("200.00"), l.getTotal());
    }
}
