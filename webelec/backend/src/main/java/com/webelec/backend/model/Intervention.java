package com.webelec.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "interventions")
public class Intervention {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String titre;

    @Column(length = 1024)
    private String description;

    @Column(name = "date_intervention")
    private LocalDate dateIntervention;

    @ManyToOne(optional = false)
    @JoinColumn(name = "societe_id")
    private Societe societe;

    @ManyToOne(optional = false)
    @JoinColumn(name = "chantier_id")
    private Chantier chantier;

    @ManyToOne(optional = false)
    @JoinColumn(name = "client_id")
    private Client client;

    public Intervention() {
    }

    public Intervention(Long id, String titre, String description, LocalDate dateIntervention,
                        Societe societe, Chantier chantier, Client client) {
        this.id = id;
        this.titre = titre;
        this.description = description;
        this.dateIntervention = dateIntervention;
        this.societe = societe;
        this.chantier = chantier;
        this.client = client;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDateIntervention() {
        return dateIntervention;
    }

    public void setDateIntervention(LocalDate dateIntervention) {
        this.dateIntervention = dateIntervention;
    }

    public Societe getSociete() {
        return societe;
    }

    public void setSociete(Societe societe) {
        this.societe = societe;
    }

    public Chantier getChantier() {
        return chantier;
    }

    public void setChantier(Chantier chantier) {
        this.chantier = chantier;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static final class Builder {
        private Long id;
        private String titre;
        private String description;
        private LocalDate dateIntervention;
        private Societe societe;
        private Chantier chantier;
        private Client client;

        private Builder() {
        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder titre(String titre) {
            this.titre = titre;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder dateIntervention(LocalDate dateIntervention) {
            this.dateIntervention = dateIntervention;
            return this;
        }

        public Builder societe(Societe societe) {
            this.societe = societe;
            return this;
        }

        public Builder chantier(Chantier chantier) {
            this.chantier = chantier;
            return this;
        }

        public Builder client(Client client) {
            this.client = client;
            return this;
        }

        public Intervention build() {
            return new Intervention(id, titre, description, dateIntervention, societe, chantier, client);
        }
    }
}
