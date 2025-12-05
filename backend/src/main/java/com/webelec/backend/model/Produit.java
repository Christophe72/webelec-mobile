package com.webelec.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "produits")
public class Produit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255, unique = true)
    private String reference;

    @Column(nullable = false, length = 255)
    private String nom;

    @Column(length = 1024)
    private String description;

    private Integer quantiteStock;

    @Column(name = "prix_unitaire", precision = 12, scale = 2)
    private BigDecimal prixUnitaire;

    @ManyToOne
    @JoinColumn(name = "societe_id")
    private Societe societe;

    public Produit() {}

    public Produit(Long id, String reference, String nom, String description,
                   Integer quantiteStock, BigDecimal prixUnitaire, Societe societe) {
        this.id = id;
        this.reference = reference;
        this.nom = nom;
        this.description = description;
        this.quantiteStock = quantiteStock;
        this.prixUnitaire = prixUnitaire;
        this.societe = societe;
    }

    public static Builder builder() { return new Builder(); }

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

    public Societe getSociete() { return societe; }
    public void setSociete(Societe societe) { this.societe = societe; }

    public static final class Builder {
        private Long id;
        private String reference;
        private String nom;
        private String description;
        private Integer quantiteStock;
        private BigDecimal prixUnitaire;
        private Societe societe;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder reference(String reference) { this.reference = reference; return this; }
        public Builder nom(String nom) { this.nom = nom; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder quantiteStock(Integer quantiteStock) { this.quantiteStock = quantiteStock; return this; }
        public Builder prixUnitaire(BigDecimal prixUnitaire) { this.prixUnitaire = prixUnitaire; return this; }
        public Builder societe(Societe societe) { this.societe = societe; return this; }

        public Produit build() {
            return new Produit(id, reference, nom, description, quantiteStock, prixUnitaire, societe);
        }
    }
}