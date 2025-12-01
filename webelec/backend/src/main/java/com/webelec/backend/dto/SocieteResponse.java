package com.webelec.backend.dto;

import com.webelec.backend.model.Societe;

public record SocieteResponse(
        Long id,
        String nom,
        String tva,
        String email,
        String telephone,
        String adresse
) {
    public static SocieteResponse from(Societe entity) {
        return new SocieteResponse(
                entity.getId(),
                entity.getNom(),
                entity.getTva(),
                entity.getEmail(),
                entity.getTelephone(),
                entity.getAdresse()
        );
    }
}
