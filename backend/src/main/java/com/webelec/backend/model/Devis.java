package com.webelec.backend.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "devis")
public class Devis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String numero;

    @Column(nullable = false)
    private LocalDate dateEmission;

    @Column(nullable = false)
    private LocalDate dateExpiration;

    @Column(name = "montant_ht", nullable = false, precision = 12, scale = 2)
    private BigDecimal montantHT;

    @Column(name = "montant_tva", precision = 12, scale = 2)
    private BigDecimal montantTVA;

    @Column(name = "montant_ttc", precision = 12, scale = 2)
    private BigDecimal montantTTC;

    @Column(length = 20)
    private String statut;

    @ManyToOne(optional = false)
    @JoinColumn(name = "societe_id")
    private Societe societe;

    @ManyToOne(optional = false)
    @JoinColumn(name = "client_id")
    private Client client;

    @OneToMany(mappedBy = "devis", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DevisLigne> lignes = new ArrayList<>();

    public Devis() {
    }

    public Devis(Long id, String numero, LocalDate dateEmission, LocalDate dateExpiration,
                 BigDecimal montantHT, BigDecimal montantTVA, BigDecimal montantTTC,
                 String statut, Societe societe, Client client) {
        this.id = id;
        this.numero = numero;
        this.dateEmission = dateEmission;
        this.dateExpiration = dateExpiration;
        this.montantHT = montantHT;
        this.montantTVA = montantTVA;
        this.montantTTC = montantTTC;
        this.statut = statut;
        this.societe = societe;
        this.client = client;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public LocalDate getDateExpiration() {
        return dateExpiration;
    }

    public void setDateExpiration(LocalDate dateExpiration) {
        this.dateExpiration = dateExpiration;
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

    public Societe getSociete() {
        return societe;
    }

    public void setSociete(Societe societe) {
        this.societe = societe;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public List<DevisLigne> getLignes() {
        return lignes;
    }

    public void setLignes(List<DevisLigne> lignes) {
        this.lignes = lignes;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static final class Builder {
        private Long id;
        private String numero;
        private LocalDate dateEmission;
        private LocalDate dateExpiration;
        private BigDecimal montantHT;
        private BigDecimal montantTVA;
        private BigDecimal montantTTC;
        private String statut;
        private Societe societe;
        private Client client;
        private List<DevisLigne> lignes = new ArrayList<>();

        private Builder() {
        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder numero(String numero) {
            this.numero = numero;
            return this;
        }

        public Builder dateEmission(LocalDate dateEmission) {
            this.dateEmission = dateEmission;
            return this;
        }

        public Builder dateExpiration(LocalDate dateExpiration) {
            this.dateExpiration = dateExpiration;
            return this;
        }

        public Builder montantHT(BigDecimal montantHT) {
            this.montantHT = montantHT;
            return this;
        }

        public Builder montantTVA(BigDecimal montantTVA) {
            this.montantTVA = montantTVA;
            return this;
        }

        public Builder montantTTC(BigDecimal montantTTC) {
            this.montantTTC = montantTTC;
            return this;
        }

        public Builder statut(String statut) {
            this.statut = statut;
            return this;
        }

        public Builder societe(Societe societe) {
            this.societe = societe;
            return this;
        }

        public Builder client(Client client) {
            this.client = client;
            return this;
        }

        public Builder lignes(List<DevisLigne> lignes) {
            this.lignes = lignes;
            return this;
        }

        public Devis build() {
            Devis devis = new Devis(id, numero, dateEmission, dateExpiration,
                    montantHT, montantTVA, montantTTC, statut, societe, client);
            devis.setLignes(lignes);
            return devis;
        }
    }
}