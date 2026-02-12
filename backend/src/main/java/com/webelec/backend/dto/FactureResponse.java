package com.webelec.backend.dto;

import com.webelec.backend.model.Facture;
import com.webelec.backend.model.FactureLigne;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class FactureResponse {

    private Long id;
    private String numero;
    private LocalDate dateEmission;
    private LocalDate dateEcheance;
    private BigDecimal montantHT;
    private BigDecimal montantTVA;
    private BigDecimal montantTTC;
    private String statut;
    private Long societeId;
    private Long clientId;
    private List<FactureLigneResponse> lignes;

    // Champs Peppol
    private Boolean peppolEnabled;
    private String peppolSenderEndpointId;
    private String peppolReceiverEndpointId;
    private String peppolStatus;
    private String peppolFormat;
    private LocalDate peppolSentDate;
    private String peppolTransactionId;
    private String peppolErrorMessage;

    public FactureResponse() {
    }

    // Constructeur de compatibilité (sans champs Peppol)
    public FactureResponse(Long id, String numero, LocalDate dateEmission, LocalDate dateEcheance,
                           BigDecimal montantHT, BigDecimal montantTVA, BigDecimal montantTTC,
                           String statut, Long societeId, Long clientId, List<FactureLigneResponse> lignes) {
        this(id, numero, dateEmission, dateEcheance, montantHT, montantTVA, montantTTC, statut,
             societeId, clientId, lignes, false, null, null, null, null, null, null, null);
    }

    public FactureResponse(Long id, String numero, LocalDate dateEmission, LocalDate dateEcheance,
                           BigDecimal montantHT, BigDecimal montantTVA, BigDecimal montantTTC,
                           String statut, Long societeId, Long clientId, List<FactureLigneResponse> lignes,
                           Boolean peppolEnabled, String peppolSenderEndpointId, String peppolReceiverEndpointId,
                           String peppolStatus, String peppolFormat, LocalDate peppolSentDate,
                           String peppolTransactionId, String peppolErrorMessage) {
        this.id = id;
        this.numero = numero;
        this.dateEmission = dateEmission;
        this.dateEcheance = dateEcheance;
        this.montantHT = montantHT;
        this.montantTVA = montantTVA;
        this.montantTTC = montantTTC;
        this.statut = statut;
        this.societeId = societeId;
        this.clientId = clientId;
        this.lignes = lignes;
        this.peppolEnabled = peppolEnabled;
        this.peppolSenderEndpointId = peppolSenderEndpointId;
        this.peppolReceiverEndpointId = peppolReceiverEndpointId;
        this.peppolStatus = peppolStatus;
        this.peppolFormat = peppolFormat;
        this.peppolSentDate = peppolSentDate;
        this.peppolTransactionId = peppolTransactionId;
        this.peppolErrorMessage = peppolErrorMessage;
    }

    public static FactureResponse from(Facture entity) {
        return new FactureResponse(
                entity.getId(),
                entity.getNumero(),
                entity.getDateEmission(),
                entity.getDateEcheance(),
                entity.getMontantHT(),
                entity.getMontantTVA(),
                entity.getMontantTTC(),
                entity.getStatut(),
                entity.getSociete().getId(),
                entity.getClient().getId(),
                entity.getLignes().stream().map(FactureLigneResponse::from).toList(),
                entity.getPeppolEnabled(),
                entity.getPeppolSenderEndpointId(),
                entity.getPeppolReceiverEndpointId(),
                entity.getPeppolStatus(),
                entity.getPeppolFormat(),
                entity.getPeppolSentDate(),
                entity.getPeppolTransactionId(),
                entity.getPeppolErrorMessage()
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

    public List<FactureLigneResponse> getLignes() {
        return lignes;
    }

    public void setLignes(List<FactureLigneResponse> lignes) {
        this.lignes = lignes;
    }

    public Boolean getPeppolEnabled() {
        return peppolEnabled;
    }

    public void setPeppolEnabled(Boolean peppolEnabled) {
        this.peppolEnabled = peppolEnabled;
    }

    public String getPeppolSenderEndpointId() {
        return peppolSenderEndpointId;
    }

    public void setPeppolSenderEndpointId(String peppolSenderEndpointId) {
        this.peppolSenderEndpointId = peppolSenderEndpointId;
    }

    public String getPeppolReceiverEndpointId() {
        return peppolReceiverEndpointId;
    }

    public void setPeppolReceiverEndpointId(String peppolReceiverEndpointId) {
        this.peppolReceiverEndpointId = peppolReceiverEndpointId;
    }

    public String getPeppolStatus() {
        return peppolStatus;
    }

    public void setPeppolStatus(String peppolStatus) {
        this.peppolStatus = peppolStatus;
    }

    public String getPeppolFormat() {
        return peppolFormat;
    }

    public void setPeppolFormat(String peppolFormat) {
        this.peppolFormat = peppolFormat;
    }

    public LocalDate getPeppolSentDate() {
        return peppolSentDate;
    }

    public void setPeppolSentDate(LocalDate peppolSentDate) {
        this.peppolSentDate = peppolSentDate;
    }

    public String getPeppolTransactionId() {
        return peppolTransactionId;
    }

    public void setPeppolTransactionId(String peppolTransactionId) {
        this.peppolTransactionId = peppolTransactionId;
    }

    public String getPeppolErrorMessage() {
        return peppolErrorMessage;
    }

    public void setPeppolErrorMessage(String peppolErrorMessage) {
        this.peppolErrorMessage = peppolErrorMessage;
    }

    public static class FactureLigneResponse {

        private Long id;
        private String description;
        private Integer quantite;
        private BigDecimal prixUnitaire;
        private BigDecimal total;

        public FactureLigneResponse() {
        }

        public FactureLigneResponse(Long id, String description, Integer quantite,
                                    BigDecimal prixUnitaire, BigDecimal total) {
            this.id = id;
            this.description = description;
            this.quantite = quantite;
            this.prixUnitaire = prixUnitaire;
            this.total = total;
        }

        public static FactureLigneResponse from(FactureLigne ligne) {
            return new FactureLigneResponse(
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