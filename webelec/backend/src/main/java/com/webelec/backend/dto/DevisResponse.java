package com.webelec.backend.dto;

import com.webelec.backend.model.Devis;
import com.webelec.backend.model.DevisLigne;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record DevisResponse(
        Long id,
        String numero,
        LocalDate dateEmission,
        LocalDate dateExpiration,
        BigDecimal montantHT,
        BigDecimal montantTVA,
        BigDecimal montantTTC,
        String statut,
        Long societeId,
        Long clientId,
        List<DevisLigneResponse> lignes
) {
    public static DevisResponse from(Devis entity) {
        return new DevisResponse(
                entity.getId(),
                entity.getNumero(),
                entity.getDateEmission(),
                entity.getDateExpiration(),
                entity.getMontantHT(),
                entity.getMontantTVA(),
                entity.getMontantTTC(),
                entity.getStatut(),
                entity.getSociete().getId(),
                entity.getClient().getId(),
                entity.getLignes().stream().map(DevisLigneResponse::from).toList()
        );
    }

    public record DevisLigneResponse(
            Long id,
            String description,
            Integer quantite,
            BigDecimal prixUnitaire,
            BigDecimal total
    ) {
        public static DevisLigneResponse from(DevisLigne ligne) {
            return new DevisLigneResponse(
                    ligne.getId(),
                    ligne.getDescription(),
                    ligne.getQuantite(),
                    ligne.getPrixUnitaire(),
                    ligne.getTotal()
            );
        }
    }
}
