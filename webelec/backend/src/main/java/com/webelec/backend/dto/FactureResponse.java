package com.webelec.backend.dto;

import com.webelec.backend.model.Facture;
import com.webelec.backend.model.FactureLigne;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record FactureResponse(
        Long id,
        String numero,
        LocalDate dateEmission,
        LocalDate dateEcheance,
        BigDecimal montantHT,
        BigDecimal montantTVA,
        BigDecimal montantTTC,
        String statut,
        Long societeId,
        Long clientId,
        List<FactureLigneResponse> lignes
) {
    public static FactureResponse from(Facture entity) {
        return new FactureResponse(
                entity.getId(),
                entity.getNumero(),
                entity.getDateEmission(),
                entity.getDateEcheance(),
                entity.getMontantHT(),
                entity.getMontantTVA(),
                entity.getMontantTTC(),
                entity.getStatut(),
                entity.getSociete().getId(),
                entity.getClient().getId(),
                entity.getLignes().stream().map(FactureLigneResponse::from).toList()
        );
    }

    public record FactureLigneResponse(
            Long id,
            String description,
            Integer quantite,
            BigDecimal prixUnitaire,
            BigDecimal total
    ) {
        public static FactureLigneResponse from(FactureLigne ligne) {
            return new FactureLigneResponse(
                    ligne.getId(),
                    ligne.getDescription(),
                    ligne.getQuantite(),
                    ligne.getPrixUnitaire(),
                    ligne.getTotal()
            );
        }
    }
}
