package com.webelec.backend.dto;

import com.webelec.backend.model.ProduitAvance;

import java.math.BigDecimal;

public class ProduitAvanceResponse {

    private Long id;
    private String reference;
    private String nom;
    private String description;
    private BigDecimal prixAchat;
    private BigDecimal prixVente;
    private String fournisseur;
    private Long societeId;

    public ProduitAvanceResponse() {
    }

    public ProduitAvanceResponse(Long id, String reference, String nom, String description,
                                 BigDecimal prixAchat, BigDecimal prixVente, String fournisseur, Long societeId) {
        this.id = id;
        this.reference = reference;
        this.nom = nom;
        this.description = description;
        this.prixAchat = prixAchat;
        this.prixVente = prixVente;
        this.fournisseur = fournisseur;
        this.societeId = societeId;
    }

    public static ProduitAvanceResponse from(ProduitAvance entity) {
        return new ProduitAvanceResponse(
                entity.getId(),
                entity.getReference(),
                entity.getNom(),
                entity.getDescription(),
                entity.getPrixAchat(),
                entity.getPrixVente(),
                entity.getFournisseur(),
                entity.getSociete() != null ? entity.getSociete().getId() : null
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
}