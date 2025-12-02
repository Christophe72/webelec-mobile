package com.webelec.backend.dto;

import com.webelec.backend.model.Intervention;
import com.webelec.backend.model.Societe;
import com.webelec.backend.model.Chantier;
import com.webelec.backend.model.Client;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class InterventionResponseTest {
    @Test
    void from_maps_entity_to_response() {
        Societe societe = new Societe(); societe.setId(1L);
        Chantier chantier = new Chantier(); chantier.setId(2L);
        Client client = new Client(); client.setId(3L);
        Intervention intervention = new Intervention();
        intervention.setId(4L);
        intervention.setTitre("Interv");
        intervention.setDescription("Desc");
        intervention.setDateIntervention(LocalDate.of(2025, 12, 2));
        intervention.setSociete(societe);
        intervention.setChantier(chantier);
        intervention.setClient(client);
        InterventionResponse dto = InterventionResponse.from(intervention);
        assertEquals(4L, dto.getId());
        assertEquals("Interv", dto.getTitre());
        assertEquals("Desc", dto.getDescription());
        assertEquals(LocalDate.of(2025, 12, 2), dto.getDateIntervention());
        assertEquals(1L, dto.getSocieteId());
        assertEquals(2L, dto.getChantierId());
        assertEquals(3L, dto.getClientId());
    }
    @Test
    void from_handles_nulls() {
        Intervention intervention = new Intervention();
        intervention.setId(5L);
        InterventionResponse dto = InterventionResponse.from(intervention);
        assertNull(dto.getSocieteId());
        assertNull(dto.getChantierId());
        assertNull(dto.getClientId());
    }
}
