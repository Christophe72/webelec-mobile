package com.webelec.backend.dto;

import com.webelec.backend.model.Produit;

import java.math.BigDecimal;

public class ProduitResponse {

    private Long id;
    private String reference;
    private String nom;
    private String description;
    private Integer quantiteStock;
    private BigDecimal prixUnitaire;
    private SocieteSummary societe;

    public ProduitResponse() {}

    private ProduitResponse(Long id, String reference, String nom, String description,
                            Integer quantiteStock, BigDecimal prixUnitaire, SocieteSummary societe) {
        this.id = id;
        this.reference = reference;
        this.nom = nom;
        this.description = description;
        this.quantiteStock = quantiteStock;
        this.prixUnitaire = prixUnitaire;
        this.societe = societe;
    }

    public static ProduitResponse from(Produit entity) {
        return new ProduitResponse(
                entity.getId(),
                entity.getReference(),
                entity.getNom(),
                entity.getDescription(),
                entity.getQuantiteStock(),
                entity.getPrixUnitaire(),
                SocieteSummary.from(entity.getSociete())
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getQuantiteStock() { return quantiteStock; }
    public void setQuantiteStock(Integer quantiteStock) { this.quantiteStock = quantiteStock; }
    public BigDecimal getPrixUnitaire() { return prixUnitaire; }
    public void setPrixUnitaire(BigDecimal prixUnitaire) { this.prixUnitaire = prixUnitaire; }
    public SocieteSummary getSociete() { return societe; }
    public void setSociete(SocieteSummary societe) { this.societe = societe; }
}