package com.webelec.backend.dto;

import com.webelec.backend.model.Produit;

import java.math.BigDecimal;

public record ProduitResponse(
        Long id,
        String reference,
        String nom,
        String description,
        Integer quantiteStock,
        BigDecimal prixUnitaire,
        Long societeId
) {
    public static ProduitResponse from(Produit entity) {
        return new ProduitResponse(
                entity.getId(),
                entity.getReference(),
                entity.getNom(),
                entity.getDescription(),
                entity.getQuantiteStock(),
                entity.getPrixUnitaire(),
                entity.getSociete() != null ? entity.getSociete().getId() : null
        );
    }
}
