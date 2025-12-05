package com.webelec.backend.dto;

import com.webelec.backend.model.ProduitAvance;
import com.webelec.backend.model.Societe;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class ProduitAvanceRequest {

    @NotBlank(message = "La référence est obligatoire")
    @Size(max = 255, message = "La référence ne peut dépasser 255 caractères")
    private String reference;

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 255, message = "Le nom ne peut dépasser 255 caractères")
    private String nom;

    @Size(max = 1024, message = "La description ne peut dépasser 1024 caractères")
    private String description;

    @DecimalMin(value = "0.0", inclusive = false, message = "Le prix d'achat doit être positif")
    private BigDecimal prixAchat;

    @DecimalMin(value = "0.0", inclusive = false, message = "Le prix de vente doit être positif")
    private BigDecimal prixVente;

    @Size(max = 255, message = "Le fournisseur ne peut dépasser 255 caractères")
    private String fournisseur;

    @NotNull(message = "La société est obligatoire")
    private Long societeId;

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrixAchat() {
        return prixAchat;
    }

    public void setPrixAchat(BigDecimal prixAchat) {
        this.prixAchat = prixAchat;
    }

    public BigDecimal getPrixVente() {
        return prixVente;
    }

    public void setPrixVente(BigDecimal prixVente) {
        this.prixVente = prixVente;
    }

    public String getFournisseur() {
        return fournisseur;
    }

    public void setFournisseur(String fournisseur) {
        this.fournisseur = fournisseur;
    }

    public Long getSocieteId() {
        return societeId;
    }

    public void setSocieteId(Long societeId) {
        this.societeId = societeId;
    }

    public ProduitAvance toEntity() {
        Societe societe = new Societe();
        societe.setId(societeId);

        return ProduitAvance.builder()
                .reference(this.reference)
                .nom(this.nom)
                .description(this.description)
                .prixAchat(this.prixAchat)
                .prixVente(this.prixVente)
                .fournisseur(this.fournisseur)
                .societe(societe)
                .build();
    }
}
