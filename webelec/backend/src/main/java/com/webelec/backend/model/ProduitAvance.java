package com.webelec.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "produits_avances")
public class ProduitAvance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String reference;

    @Column(nullable = false)
    private String nom;

    @Column(length = 1024)
    private String description;

    @Column(precision = 12, scale = 2)
    private BigDecimal prixAchat;

    @Column(precision = 12, scale = 2)
    private BigDecimal prixVente;

    @Column(length = 255)
    private String fournisseur;

    @ManyToOne(optional = false)
    @JoinColumn(name = "societe_id")
    private Societe societe;

    public ProduitAvance() {
    }

    public ProduitAvance(Long id, String reference, String nom, String description,
                         BigDecimal prixAchat, BigDecimal prixVente, String fournisseur, Societe societe) {
        this.id = id;
        this.reference = reference;
        this.nom = nom;
        this.description = description;
        this.prixAchat = prixAchat;
        this.prixVente = prixVente;
        this.fournisseur = fournisseur;
        this.societe = societe;
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

    public Societe getSociete() {
        return societe;
    }

    public void setSociete(Societe societe) {
        this.societe = societe;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static final class Builder {
        private Long id;
        private String reference;
        private String nom;
        private String description;
        private BigDecimal prixAchat;
        private BigDecimal prixVente;
        private String fournisseur;
        private Societe societe;

        private Builder() {
        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder reference(String reference) {
            this.reference = reference;
            return this;
        }

        public Builder nom(String nom) {
            this.nom = nom;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder prixAchat(BigDecimal prixAchat) {
            this.prixAchat = prixAchat;
            return this;
        }

        public Builder prixVente(BigDecimal prixVente) {
            this.prixVente = prixVente;
            return this;
        }

        public Builder fournisseur(String fournisseur) {
            this.fournisseur = fournisseur;
            return this;
        }

        public Builder societe(Societe societe) {
            this.societe = societe;
            return this;
        }

        public ProduitAvance build() {
            return new ProduitAvance(id, reference, nom, description, prixAchat, prixVente, fournisseur, societe);
        }
    }
}
