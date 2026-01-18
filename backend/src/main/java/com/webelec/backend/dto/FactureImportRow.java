package com.webelec.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a single row from a CSV import file.
 * All fields are strings to allow flexible parsing and error reporting.
 */
@Data
@Builder
@NoArgsConstructor

@AllArgsConstructor
public class FactureImportRow {

    private int rowNumber;

    // Invoice fields
    private String numero;
    private String dateEmission;
    private String dateEcheance;
    private String montantHT;
    private String montantTVA;
    private String montantTTC;
    private String statut;

    // Client fields
    private String clientNom;
    private String clientPrenom;
    private String clientEmail;
    private String clientTelephone;
    private String clientAdresse;

    // Line items data (format: "desc|qty|price|total;desc|qty|price|total")
    private String lignes;
}
