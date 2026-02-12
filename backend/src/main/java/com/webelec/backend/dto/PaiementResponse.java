package com.webelec.backend.dto;

import com.webelec.backend.model.Paiement;
import java.math.BigDecimal;
import java.time.LocalDate;

public record PaiementResponse(
    Long id,
    BigDecimal montant,
    LocalDate date,
    String mode,
    String reference,
    Long factureId
) {
    public static PaiementResponse from(Paiement paiement) {
        return new PaiementResponse(
            paiement.getId(),
            paiement.getMontant(),
            paiement.getDate(),
            paiement.getMode(),
            paiement.getReference(),
            paiement.getFacture().getId()
        );
    }
}
