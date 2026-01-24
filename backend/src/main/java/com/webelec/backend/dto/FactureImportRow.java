package com.webelec.backend.dto;

/**
 * Represents a single row from a CSV import file.
 * All fields are strings to allow flexible parsing and error reporting.
 */
public class FactureImportRow {

    private int rowNumber;
    private String numero;
    private String dateEmission;
    private String dateEcheance;
    private String montantHT;
    private String montantTVA;
    private String montantTTC;
    private String statut;
    private String clientNom;
    private String clientPrenom;
    private String clientEmail;
    private String clientTelephone;
    private String clientAdresse;
    private String lignes;

    public FactureImportRow() {
    }

    public FactureImportRow(int rowNumber, String numero, String dateEmission, String dateEcheance,
                            String montantHT, String montantTVA, String montantTTC, String statut,
                            String clientNom, String clientPrenom, String clientEmail,
                            String clientTelephone, String clientAdresse, String lignes) {
        this.rowNumber = rowNumber;
        this.numero = numero;
        this.dateEmission = dateEmission;
        this.dateEcheance = dateEcheance;
        this.montantHT = montantHT;
        this.montantTVA = montantTVA;
        this.montantTTC = montantTTC;
        this.statut = statut;
        this.clientNom = clientNom;
        this.clientPrenom = clientPrenom;
        this.clientEmail = clientEmail;
        this.clientTelephone = clientTelephone;
        this.clientAdresse = clientAdresse;
        this.lignes = lignes;
    }

    public int getRowNumber() {
        return rowNumber;
    }

    public void setRowNumber(int rowNumber) {
        this.rowNumber = rowNumber;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getDateEmission() {
        return dateEmission;
    }

    public void setDateEmission(String dateEmission) {
        this.dateEmission = dateEmission;
    }

    public String getDateEcheance() {
        return dateEcheance;
    }

    public void setDateEcheance(String dateEcheance) {
        this.dateEcheance = dateEcheance;
    }

    public String getMontantHT() {
        return montantHT;
    }

    public void setMontantHT(String montantHT) {
        this.montantHT = montantHT;
    }

    public String getMontantTVA() {
        return montantTVA;
    }

    public void setMontantTVA(String montantTVA) {
        this.montantTVA = montantTVA;
    }

    public String getMontantTTC() {
        return montantTTC;
    }

    public void setMontantTTC(String montantTTC) {
        this.montantTTC = montantTTC;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public String getClientNom() {
        return clientNom;
    }

    public void setClientNom(String clientNom) {
        this.clientNom = clientNom;
    }

    public String getClientPrenom() {
        return clientPrenom;
    }

    public void setClientPrenom(String clientPrenom) {
        this.clientPrenom = clientPrenom;
    }

    public String getClientEmail() {
        return clientEmail;
    }

    public void setClientEmail(String clientEmail) {
        this.clientEmail = clientEmail;
    }

    public String getClientTelephone() {
        return clientTelephone;
    }

    public void setClientTelephone(String clientTelephone) {
        this.clientTelephone = clientTelephone;
    }

    public String getClientAdresse() {
        return clientAdresse;
    }

    public void setClientAdresse(String clientAdresse) {
        this.clientAdresse = clientAdresse;
    }

    public String getLignes() {
        return lignes;
    }

    public void setLignes(String lignes) {
        this.lignes = lignes;
    }
}