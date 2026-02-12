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
import jakarta.persistence.UniqueConstraint;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "factures", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"societe_id", "numero"})
})
public class Facture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String numero;

    @Column(nullable = false)
    private LocalDate dateEmission;

    @Column(nullable = false)
    private LocalDate dateEcheance;

    @Column(name = "montant_ht", nullable = false, precision = 12, scale = 2)
    private BigDecimal montantHT;

    @Column(name = "montant_tva", nullable = false, precision = 12, scale = 2)
    private BigDecimal montantTVA;

    @Column(name = "montant_ttc", nullable = false, precision = 12, scale = 2)
    private BigDecimal montantTTC;

    @Column(length = 20)
    private String statut;

    // Champs spécifiques Peppol
    @Column(name = "peppol_enabled")
    private Boolean peppolEnabled = false;

    @Column(name = "peppol_sender_endpoint_id", length = 100)
    private String peppolSenderEndpointId;

    @Column(name = "peppol_receiver_endpoint_id", length = 100)
    private String peppolReceiverEndpointId;

    @Column(name = "peppol_status", length = 20)
    private String peppolStatus; // DRAFT, READY, SENT, DELIVERED, ERROR

    @Column(name = "peppol_format", length = 20)
    private String peppolFormat; // UBL_2_1, CII

    @Column(name = "peppol_sent_date")
    private LocalDate peppolSentDate;

    @Column(name = "peppol_transaction_id", length = 100)
    private String peppolTransactionId;

    @Column(name = "peppol_error_message", length = 500)
    private String peppolErrorMessage;

    @ManyToOne(optional = false)
    @JoinColumn(name = "societe_id")
    private Societe societe;

    @ManyToOne(optional = false)
    @JoinColumn(name = "client_id")
    private Client client;

    @OneToMany(mappedBy = "facture", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FactureLigne> lignes = new ArrayList<>();

    public Facture() {
    }

    public Facture(Long id, String numero, LocalDate dateEmission, LocalDate dateEcheance,
                   BigDecimal montantHT, BigDecimal montantTVA, BigDecimal montantTTC,
                   String statut, Societe societe, Client client) {
        this.id = id;
        this.numero = numero;
        this.dateEmission = dateEmission;
        this.dateEcheance = dateEcheance;
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

    public List<FactureLigne> getLignes() {
        return lignes;
    }

    public void setLignes(List<FactureLigne> lignes) {
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

    public static Builder builder() {
        return new Builder();
    }

    public static final class Builder {
        private Long id;
        private String numero;
        private LocalDate dateEmission;
        private LocalDate dateEcheance;
        private BigDecimal montantHT;
        private BigDecimal montantTVA;
        private BigDecimal montantTTC;
        private String statut;
        private Boolean peppolEnabled;
        private String peppolSenderEndpointId;
        private String peppolReceiverEndpointId;
        private String peppolStatus;
        private String peppolFormat;
        private LocalDate peppolSentDate;
        private String peppolTransactionId;
        private String peppolErrorMessage;
        private Societe societe;
        private Client client;
        private List<FactureLigne> lignes = new ArrayList<>();

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

        public Builder dateEcheance(LocalDate dateEcheance) {
            this.dateEcheance = dateEcheance;
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

        public Builder lignes(List<FactureLigne> lignes) {
            this.lignes = lignes;
            return this;
        }

        public Builder peppolEnabled(Boolean peppolEnabled) {
            this.peppolEnabled = peppolEnabled;
            return this;
        }

        public Builder peppolSenderEndpointId(String peppolSenderEndpointId) {
            this.peppolSenderEndpointId = peppolSenderEndpointId;
            return this;
        }

        public Builder peppolReceiverEndpointId(String peppolReceiverEndpointId) {
            this.peppolReceiverEndpointId = peppolReceiverEndpointId;
            return this;
        }

        public Builder peppolStatus(String peppolStatus) {
            this.peppolStatus = peppolStatus;
            return this;
        }

        public Builder peppolFormat(String peppolFormat) {
            this.peppolFormat = peppolFormat;
            return this;
        }

        public Builder peppolSentDate(LocalDate peppolSentDate) {
            this.peppolSentDate = peppolSentDate;
            return this;
        }

        public Builder peppolTransactionId(String peppolTransactionId) {
            this.peppolTransactionId = peppolTransactionId;
            return this;
        }

        public Builder peppolErrorMessage(String peppolErrorMessage) {
            this.peppolErrorMessage = peppolErrorMessage;
            return this;
        }

        public Facture build() {
            Facture facture = new Facture(id, numero, dateEmission, dateEcheance,
                    montantHT, montantTVA, montantTTC, statut, societe, client);
            facture.setLignes(lignes);
            facture.setPeppolEnabled(peppolEnabled);
            facture.setPeppolSenderEndpointId(peppolSenderEndpointId);
            facture.setPeppolReceiverEndpointId(peppolReceiverEndpointId);
            facture.setPeppolStatus(peppolStatus);
            facture.setPeppolFormat(peppolFormat);
            facture.setPeppolSentDate(peppolSentDate);
            facture.setPeppolTransactionId(peppolTransactionId);
            facture.setPeppolErrorMessage(peppolErrorMessage);
            return facture;
        }
    }
}
