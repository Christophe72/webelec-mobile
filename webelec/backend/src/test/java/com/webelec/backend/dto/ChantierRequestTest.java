package com.webelec.backend.dto;

import com.webelec.backend.model.Chantier;
import com.webelec.backend.model.Societe;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ChantierRequestTest {
    @Test
    void toEntity_maps_request_to_entity() {
        ChantierRequest req = new ChantierRequest();
        req.setNom("Chantier Test");
        req.setAdresse("Adresse Test");
        req.setDescription("Description Test");
        req.setSocieteId(123L);

        Chantier chantier = req.toEntity();
        assertEquals("Chantier Test", chantier.getNom());
        assertEquals("Adresse Test", chantier.getAdresse());
        assertEquals("Description Test", chantier.getDescription());
        assertNotNull(chantier.getSociete());
        assertEquals(123L, chantier.getSociete().getId());
    }
}
