package com.webelec.backend.dto;

import com.webelec.backend.model.Client;
import com.webelec.backend.model.Societe;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ClientResponseTest {
    @Test
    void from_maps_entity_to_response() {
        Societe societe = new Societe();
        societe.setId(99L);
        societe.setNom("WebElec");
        Client client = new Client(1L, "Nom", "Prenom", "mail@test.com", "0123456789", "Adresse", societe);

        ClientResponse dto = ClientResponse.from(client);

        assertEquals(1L, dto.getId());
        assertEquals("Nom", dto.getNom());
        assertEquals("Prenom", dto.getPrenom());
        assertEquals("0123456789", dto.getTelephone());
        assertEquals("Adresse", dto.getAdresse());
        assertNotNull(dto.getSociete());
        assertEquals(99L, dto.getSociete().getId());
        assertEquals("WebElec", dto.getSociete().getNom());
    }

    @Test
    void from_handles_null_societe() {
        Client client = new Client(2L, "Nom2", "Prenom2", "mail2@test.com", "9876543210", "Adresse2", null);
        ClientResponse dto = ClientResponse.from(client);
        assertNull(dto.getSociete());
    }
}