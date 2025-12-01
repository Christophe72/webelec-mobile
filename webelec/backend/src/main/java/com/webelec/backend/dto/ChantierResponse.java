package com.webelec.backend.dto;

import com.webelec.backend.model.Chantier;

public record ChantierResponse(
        Long id,
        String nom,
        String adresse,
        String description,
        Long societeId
) {
    public static ChantierResponse from(Chantier entity) {
        return new ChantierResponse(
                entity.getId(),
                entity.getNom(),
                entity.getAdresse(),
                entity.getDescription(),
                entity.getSociete() != null ? entity.getSociete().getId() : null
        );
    }
}
