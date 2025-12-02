package com.webelec.backend.dto;

import com.webelec.backend.model.Devis;
import com.webelec.backend.model.DevisLigne;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class DevisResponse {

    private Long id;
    private String numero;
    private LocalDate dateEmission;
    private LocalDate dateExpiration;
    private BigDecimal montantHT;
    private BigDecimal montantTVA;
    private BigDecimal montantTTC;
    private String statut;
    private Long societeId;
    private Long clientId;
    private List<DevisLigneResponse> lignes;

    public DevisResponse() {
    }

    public DevisResponse(Long id, String numero, LocalDate dateEmission, LocalDate dateExpiration,
                         BigDecimal montantHT, BigDecimal montantTVA, BigDecimal montantTTC,
                         String statut, Long societeId, Long clientId, List<DevisLigneResponse> lignes) {
        this.id = id;
        this.numero = numero;
        this.dateEmission = dateEmission;
        this.dateExpiration = dateExpiration;
        this.montantHT = montantHT;
        this.montantTVA = montantTVA;
        this.montantTTC = montantTTC;
        this.statut = statut;
        this.societeId = societeId;
        this.clientId = clientId;
        this.lignes = lignes;
    }

    public static DevisResponse from(Devis entity) {
        return new DevisResponse(
                entity.getId(),
                entity.getNumero(),
                entity.getDateEmission(),
                entity.getDateExpiration(),
                entity.getMontantHT(),
                entity.getMontantTVA(),
                entity.getMontantTTC(),
                entity.getStatut(),
                entity.getSociete().getId(),
                entity.getClient().getId(),
                entity.getLignes().stream().map(DevisLigneResponse::from).toList()
        );
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

    public List<DevisLigneResponse> getLignes() {
        return lignes;
    }

    public void setLignes(List<DevisLigneResponse> lignes) {
        this.lignes = lignes;
    }

    public static class DevisLigneResponse {

        private Long id;
        private String description;
        private Integer quantite;
        private BigDecimal prixUnitaire;
        private BigDecimal total;

        public DevisLigneResponse() {
        }

        public DevisLigneResponse(Long id, String description, Integer quantite,
                                  BigDecimal prixUnitaire, BigDecimal total) {
            this.id = id;
            this.description = description;
            this.quantite = quantite;
            this.prixUnitaire = prixUnitaire;
            this.total = total;
        }

        public static DevisLigneResponse from(DevisLigne ligne) {
            return new DevisLigneResponse(
                    ligne.getId(),
                    ligne.getDescription(),
                    ligne.getQuantite(),
                    ligne.getPrixUnitaire(),
                    ligne.getTotal()
            );
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public Integer getQuantite() {
            return quantite;
        }

        public void setQuantite(Integer quantite) {
            this.quantite = quantite;
        }

        public BigDecimal getPrixUnitaire() {
            return prixUnitaire;
        }

        public void setPrixUnitaire(BigDecimal prixUnitaire) {
            this.prixUnitaire = prixUnitaire;
        }

        public BigDecimal getTotal() {
            return total;
        }

        public void setTotal(BigDecimal total) {
            this.total = total;
        }
    }
}