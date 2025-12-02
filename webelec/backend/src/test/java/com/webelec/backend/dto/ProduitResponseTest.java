package com.webelec.backend.dto;

import com.webelec.backend.model.Produit;
import com.webelec.backend.model.Societe;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class ProduitResponseTest {
    @Test
    void from_maps_entity_to_response() {
        Societe societe = new Societe();
        societe.setId(7L);
        Produit produit = new Produit();
        produit.setId(2L);
        produit.setReference("REF-1");
        produit.setNom("ProduitX");
        produit.setDescription("DescX");
        produit.setQuantiteStock(10);
        produit.setPrixUnitaire(new BigDecimal("99.99"));
        produit.setSociete(societe);
        ProduitResponse dto = ProduitResponse.from(produit);
        assertEquals(2L, dto.getId());
        assertEquals("REF-1", dto.getReference());
        assertEquals("ProduitX", dto.getNom());
        assertEquals("DescX", dto.getDescription());
        assertEquals(10, dto.getQuantiteStock());
        assertEquals(new BigDecimal("99.99"), dto.getPrixUnitaire());
        assertEquals(7L, dto.getSocieteId());
    }
    @Test
    void from_handles_null_societe() {
        Produit produit = new Produit();
        produit.setId(3L);
        ProduitResponse dto = ProduitResponse.from(produit);
        assertNull(dto.getSocieteId());
    }
}
