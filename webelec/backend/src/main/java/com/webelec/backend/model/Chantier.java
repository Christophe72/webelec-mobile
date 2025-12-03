package com.webelec.backend.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chantiers")
public class Chantier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String nom;

    @Column(length = 512)
    private String adresse;

    @Column(length = 1024)
    private String description;

    @ManyToOne(optional = false)
    @JoinColumn(name = "societe_id")
    private Societe societe;

    @ManyToOne(optional = false)
    @JoinColumn(name = "client_id")
    private Client client;

    @OneToMany(mappedBy = "chantier", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Intervention> interventions = new ArrayList<>();

    public Chantier() {}

    public Chantier(Long id, String nom, String adresse, String description,
                    Societe societe, Client client) {
        this.id = id;
        this.nom = nom;
        this.adresse = adresse;
        this.description = description;
        this.societe = societe;
        this.client = client;
    }

    public static Builder builder() { return new Builder(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Societe getSociete() { return societe; }
    public void setSociete(Societe societe) { this.societe = societe; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }

    public List<Intervention> getInterventions() { return interventions; }

    public static final class Builder {
        private Long id;
        private String nom;
        private String adresse;
        private String description;
        private Societe societe;
        private Client client;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder nom(String nom) { this.nom = nom; return this; }
        public Builder adresse(String adresse) { this.adresse = adresse; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder societe(Societe societe) { this.societe = societe; return this; }
        public Builder client(Client client) { this.client = client; return this; }

        public Chantier build() {
            return new Chantier(id, nom, adresse, description, societe, client);
        }
    }
}