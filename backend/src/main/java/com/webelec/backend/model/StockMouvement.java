package com.webelec.backend.model;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "stock_mouvements")
public class StockMouvement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "produit_id", nullable = false)
    private Produit produit;

    @Column(nullable = false)
    private Integer quantite;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private StockMouvementType type;

    @Column(length = 255)
    private String raison;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    public StockMouvement() {}

    public StockMouvement(Long id, Produit produit, Integer quantite, StockMouvementType type, String raison, Instant createdAt) {
        this.id = id;
        this.produit = produit;
        this.quantite = quantite;
        this.type = type;
        this.raison = raison;
        this.createdAt = createdAt;
    }

    @PrePersist
    public void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Produit getProduit() { return produit; }
    public void setProduit(Produit produit) { this.produit = produit; }

    public Integer getQuantite() { return quantite; }
    public void setQuantite(Integer quantite) { this.quantite = quantite; }

    public StockMouvementType getType() { return type; }
    public void setType(StockMouvementType type) { this.type = type; }

    public String getRaison() { return raison; }
    public void setRaison(String raison) { this.raison = raison; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
