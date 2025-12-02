package com.webelec.backend.dto;

import com.webelec.backend.model.ProduitAvance;
import com.webelec.backend.model.Societe;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class ProduitAvanceResponseTest {
    @Test
    void from_maps_entity_to_response() {
        Societe societe = new Societe();
        societe.setId(8L);
        ProduitAvance produit = new ProduitAvance();
        produit.setId(4L);
        produit.setReference("REF-2");
        produit.setNom("ProduitY");
        produit.setDescription("DescY");
        produit.setPrixAchat(new BigDecimal("10.00"));
        produit.setPrixVente(new BigDecimal("20.00"));
        produit.setFournisseur("FournisseurX");
        produit.setSociete(societe);
        ProduitAvanceResponse dto = ProduitAvanceResponse.from(produit);
        assertEquals(4L, dto.getId());
        assertEquals("REF-2", dto.getReference());
        assertEquals("ProduitY", dto.getNom());
        assertEquals("DescY", dto.getDescription());
        assertEquals(new BigDecimal("10.00"), dto.getPrixAchat());
        assertEquals(new BigDecimal("20.00"), dto.getPrixVente());
        assertEquals("FournisseurX", dto.getFournisseur());
        assertEquals(8L, dto.getSocieteId());
    }
    @Test
    void from_handles_null_societe() {
        ProduitAvance produit = new ProduitAvance();
        produit.setId(5L);
        ProduitAvanceResponse dto = ProduitAvanceResponse.from(produit);
        assertNull(dto.getSocieteId());
    }
}
