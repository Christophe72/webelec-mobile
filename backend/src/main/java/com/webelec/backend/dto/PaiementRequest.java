package com.webelec.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;

public record PaiementRequest(
    @NotNull(message = "Le montant est requis")
    @Positive(message = "Le montant doit être positif")
    BigDecimal montant,

    LocalDate date,

    String mode,

    String reference
) {
}
