package com.webelec.backend.dto;

import com.webelec.backend.model.Chantier;
import com.webelec.backend.model.Client;
import com.webelec.backend.model.Intervention;
import com.webelec.backend.model.Societe;
import com.webelec.backend.model.Utilisateur;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class InterventionResponseTest {
    @Test
    void from_maps_entity_to_response() {
        Societe societe = new Societe(); societe.setId(1L); societe.setNom("WebElec");
        Chantier chantier = new Chantier(); chantier.setId(2L); chantier.setNom("Garage");
        Client client = new Client(); client.setId(3L); client.setNom("Dupont"); client.setPrenom("Marc");
        Utilisateur utilisateur = new Utilisateur(); utilisateur.setId(4L); utilisateur.setNom("Tech"); utilisateur.setPrenom("Alex"); utilisateur.setRole("TECH");
        Intervention intervention = new Intervention();
        intervention.setId(5L);
        intervention.setTitre("Interv");
        intervention.setDescription("Desc");
        intervention.setDateIntervention(LocalDate.of(2025, 12, 2));
        intervention.setSociete(societe);
        intervention.setChantier(chantier);
        intervention.setClient(client);
        intervention.setUtilisateur(utilisateur);

        InterventionResponse dto = InterventionResponse.from(intervention);

        assertEquals(5L, dto.getId());
        assertEquals("Interv", dto.getTitre());
        assertEquals("Desc", dto.getDescription());
        assertEquals(LocalDate.of(2025, 12, 2), dto.getDateIntervention());
        assertNotNull(dto.getSociete());
        assertEquals(1L, dto.getSociete().getId());
        assertEquals("WebElec", dto.getSociete().getNom());
        assertNotNull(dto.getChantier());
        assertEquals(2L, dto.getChantier().getId());
        assertEquals("Garage", dto.getChantier().getNom());
        assertNotNull(dto.getClient());
        assertEquals(3L, dto.getClient().getId());
        assertEquals("Dupont", dto.getClient().getNom());
        assertNotNull(dto.getUtilisateur());
        assertEquals(4L, dto.getUtilisateur().getId());
        assertEquals("TECH", dto.getUtilisateur().getRole());
    }

    @Test
    void from_handles_nulls() {
        Intervention intervention = new Intervention();
        intervention.setId(6L);
        InterventionResponse dto = InterventionResponse.from(intervention);
        assertNull(dto.getSociete());
        assertNull(dto.getChantier());
        assertNull(dto.getClient());
        assertNull(dto.getUtilisateur());
    }
}