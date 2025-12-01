package com.webelec.backend.dto;

import com.webelec.backend.model.Intervention;

import java.time.LocalDate;

public record InterventionResponse(
        Long id,
        String titre,
        String description,
        LocalDate dateIntervention,
        Long societeId,
        Long chantierId,
        Long clientId
) {
    public static InterventionResponse from(Intervention entity) {
        return new InterventionResponse(
                entity.getId(),
                entity.getTitre(),
                entity.getDescription(),
                entity.getDateIntervention(),
                entity.getSociete().getId(),
                entity.getChantier().getId(),
                entity.getClient().getId()
        );
    }
}
