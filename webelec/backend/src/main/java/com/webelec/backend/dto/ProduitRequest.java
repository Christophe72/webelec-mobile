package com.webelec.backend.dto;

import com.webelec.backend.model.Produit;
import com.webelec.backend.model.Societe;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class ProduitRequest {

    @NotBlank(message = "La référence est obligatoire")
    @Size(max = 255, message = "La référence ne peut dépasser 255 caractères")
    private String reference;

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 255, message = "Le nom ne peut dépasser 255 caractères")
    private String nom;

    @Size(max = 1024, message = "La description ne peut dépasser 1024 caractères")
    private String description;

    @NotNull(message = "La quantité est obligatoire")
    private Integer quantiteStock;

    @NotNull(message = "Le prix unitaire est obligatoire")
    @DecimalMin(value = "0.0", inclusive = false, message = "Le prix doit être positif")
    private BigDecimal prixUnitaire;

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

    public Integer getQuantiteStock() {
        return quantiteStock;
    }

    public void setQuantiteStock(Integer quantiteStock) {
        this.quantiteStock = quantiteStock;
    }

    public BigDecimal getPrixUnitaire() {
        return prixUnitaire;
    }

    public void setPrixUnitaire(BigDecimal prixUnitaire) {
        this.prixUnitaire = prixUnitaire;
    }

    public Long getSocieteId() {
        return societeId;
    }

    public void setSocieteId(Long societeId) {
        this.societeId = societeId;
    }

    public Produit toEntity() {
        Societe societe = new Societe();
        societe.setId(societeId);

        return Produit.builder()
                .reference(this.reference)
                .nom(this.nom)
                .description(this.description)
                .quantiteStock(this.quantiteStock)
                .prixUnitaire(this.prixUnitaire)
                .societe(societe)
                .build();
    }
}
