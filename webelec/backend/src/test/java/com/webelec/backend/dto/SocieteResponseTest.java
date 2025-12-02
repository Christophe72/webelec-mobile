package com.webelec.backend.dto;

import com.webelec.backend.model.Societe;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SocieteResponseTest {
    @Test
    void from_maps_entity_to_response() {
        Societe societe = new Societe(1L, "NomSoc", "TVA123", "mail@a.com", "0123456789", "Adresse Soc");
        SocieteResponse dto = SocieteResponse.from(societe);
        assertEquals(1L, dto.getId());
        assertEquals("NomSoc", dto.getNom());
        assertEquals("TVA123", dto.getTva());
        assertEquals("mail@a.com", dto.getEmail());
        assertEquals("0123456789", dto.getTelephone());
        assertEquals("Adresse Soc", dto.getAdresse());
    }
}
