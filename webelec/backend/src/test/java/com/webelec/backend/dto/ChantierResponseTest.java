package com.webelec.backend.dto;

import com.webelec.backend.model.Chantier;
import com.webelec.backend.model.Client;
import com.webelec.backend.model.Societe;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ChantierResponseTest {
    @Test
    void from_maps_entity_to_response() {
        Societe societe = new Societe();
        societe.setId(42L);
        societe.setNom("WebElec");
        Client client = new Client();
        client.setId(12L);
        client.setNom("Dupont");
        client.setPrenom("Marc");
        Chantier chantier = new Chantier(1L, "Chantier A", "Adresse A", "Desc", societe, client);

        ChantierResponse dto = ChantierResponse.from(chantier);

        assertEquals(1L, dto.getId());
        assertEquals("Chantier A", dto.getNom());
        assertEquals("Adresse A", dto.getAdresse());
        assertEquals("Desc", dto.getDescription());
        assertNotNull(dto.getSociete());
        assertEquals(42L, dto.getSociete().getId());
        assertEquals("WebElec", dto.getSociete().getNom());
        assertNotNull(dto.getClient());
        assertEquals(12L, dto.getClient().getId());
        assertEquals("Dupont", dto.getClient().getNom());
    }

    @Test
    void from_handles_null_relations() {
        Chantier chantier = new Chantier(2L, "Chantier B", "Adresse B", "Desc2", null, null);
        ChantierResponse dto = ChantierResponse.from(chantier);
        assertNull(dto.getSociete());
        assertNull(dto.getClient());
    }
}