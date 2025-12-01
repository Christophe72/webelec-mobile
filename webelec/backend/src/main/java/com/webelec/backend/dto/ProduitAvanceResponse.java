package com.webelec.backend.dto;

import com.webelec.backend.model.ProduitAvance;

import java.math.BigDecimal;

public record ProduitAvanceResponse(
        Long id,
        String reference,
        String nom,
        String description,
        BigDecimal prixAchat,
        BigDecimal prixVente,
        String fournisseur,
        Long societeId
) {
    public static ProduitAvanceResponse from(ProduitAvance entity) {
        return new ProduitAvanceResponse(
                entity.getId(),
                entity.getReference(),
                entity.getNom(),
                entity.getDescription(),
                entity.getPrixAchat(),
                entity.getPrixVente(),
                entity.getFournisseur(),
                entity.getSociete().getId()
        );
    }
}
