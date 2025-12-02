package com.webelec.backend.dto;

import com.webelec.backend.model.Chantier;
import com.webelec.backend.model.Societe;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ChantierResponseTest {
    @Test
    void from_maps_entity_to_response() {
        Societe societe = new Societe();
        societe.setId(42L);
        Chantier chantier = new Chantier(1L, "Chantier A", "Adresse A", "Desc", societe);

        ChantierResponse dto = ChantierResponse.from(chantier);

        assertEquals(1L, dto.getId());
        assertEquals("Chantier A", dto.getNom());
        assertEquals("Adresse A", dto.getAdresse());
        assertEquals("Desc", dto.getDescription());
        assertEquals(42L, dto.getSocieteId());
    }

    @Test
    void from_handles_null_societe() {
        Chantier chantier = new Chantier(2L, "Chantier B", "Adresse B", "Desc2", null);
        ChantierResponse dto = ChantierResponse.from(chantier);
        assertNull(dto.getSocieteId());
    }
}
