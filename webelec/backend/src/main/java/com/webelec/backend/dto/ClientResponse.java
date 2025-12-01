package com.webelec.backend.dto;

import com.webelec.backend.model.Client;

public record ClientResponse(
        Long id,
        String nom,
        String prenom,
        String email,
        String telephone,
        String adresse,
        Long societeId
) {
    public static ClientResponse from(Client entity) {
        return new ClientResponse(
                entity.getId(),
                entity.getNom(),
                entity.getPrenom(),
                entity.getEmail(),
                entity.getTelephone(),
                entity.getAdresse(),
                entity.getSociete() != null ? entity.getSociete().getId() : null
        );
    }
}
