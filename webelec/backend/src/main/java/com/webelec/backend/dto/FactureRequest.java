package com.webelec.backend.dto;

import com.webelec.backend.model.Client;
import com.webelec.backend.model.Facture;
import com.webelec.backend.model.FactureLigne;
import com.webelec.backend.model.Societe;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public class FactureRequest {

    @NotBlank(message = "Le numéro de facture est obligatoire")
    private String numero;

    @NotNull(message = "La date d'émission est obligatoire")
    private LocalDate dateEmission;

    @NotNull(message = "La date d'échéance est obligatoire")
    private LocalDate dateEcheance;

    @NotNull(message = "Le montant HT est obligatoire")
    @DecimalMin(value = "0.0", inclusive = false, message = "Le montant doit être positif")
    private BigDecimal montantHT;

    @NotNull(message = "Le montant TVA est obligatoire")
    @DecimalMin(value = "0.0", message = "La TVA ne peut être négative")
    private BigDecimal montantTVA;

    @NotNull(message = "Le montant TTC est obligatoire")
    @DecimalMin(value = "0.0", inclusive = false, message = "Le montant doit être positif")
    private BigDecimal montantTTC;

    @NotBlank(message = "Le statut est obligatoire")
    private String statut;

    @NotNull(message = "La société est obligatoire")
    private Long societeId;

    @NotNull(message = "Le client est obligatoire")
    private Long clientId;

    @NotEmpty(message = "Les lignes de facture sont obligatoires")
    @Valid
    private List<FactureLigneRequest> lignes;

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public LocalDate getDateEmission() {
        return dateEmission;
    }

    public void setDateEmission(LocalDate dateEmission) {
        this.dateEmission = dateEmission;
    }

    public LocalDate getDateEcheance() {
        return dateEcheance;
    }

    public void setDateEcheance(LocalDate dateEcheance) {
        this.dateEcheance = dateEcheance;
    }

    public BigDecimal getMontantHT() {
        return montantHT;
    }

    public void setMontantHT(BigDecimal montantHT) {
        this.montantHT = montantHT;
    }

    public BigDecimal getMontantTVA() {
        return montantTVA;
    }

    public void setMontantTVA(BigDecimal montantTVA) {
        this.montantTVA = montantTVA;
    }

    public BigDecimal getMontantTTC() {
        return montantTTC;
    }

    public void setMontantTTC(BigDecimal montantTTC) {
        this.montantTTC = montantTTC;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public Long getSocieteId() {
        return societeId;
    }

    public void setSocieteId(Long societeId) {
        this.societeId = societeId;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public List<FactureLigneRequest> getLignes() {
        return lignes;
    }

    public void setLignes(List<FactureLigneRequest> lignes) {
        this.lignes = lignes;
    }

    public Facture toEntity() {
        Societe societe = new Societe();
        societe.setId(societeId);

        Client client = new Client();
        client.setId(clientId);

        List<FactureLigne> mapped = lignes.stream()
                .map(FactureLigneRequest::toEntity)
                .collect(Collectors.toList());

        Facture facture = Facture.builder()
                .numero(numero)
                .dateEmission(dateEmission)
                .dateEcheance(dateEcheance)
                .montantHT(montantHT)
                .montantTVA(montantTVA)
                .montantTTC(montantTTC)
                .statut(statut)
                .societe(societe)
                .client(client)
                .build();
        mapped.forEach(l -> l.setFacture(facture));
        facture.setLignes(mapped);
        return facture;
    }
}
