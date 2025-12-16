package com.webelec.backend.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "societes")
public class Societe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String tva;
    private String telephone;
    private String email;
    private String adresse;

    @OneToMany(mappedBy = "societe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserSocieteRole> utilisateurs = new ArrayList<>();

    @OneToMany(mappedBy = "societe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Client> clients = new ArrayList<>();

    @OneToMany(mappedBy = "societe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Chantier> chantiers = new ArrayList<>();

    @OneToMany(mappedBy = "societe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Produit> produits = new ArrayList<>();

    @OneToMany(mappedBy = "societe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Intervention> interventions = new ArrayList<>();

    public Societe() {}

    public Societe(Long id, String nom, String tva, String telephone, String email,
                   String adresse) {
        this.id = id;
        this.nom = nom;
        this.tva = tva;
        this.telephone = telephone;
        this.email = email;
        this.adresse = adresse;
    }

    public static Builder builder() {
        return new Builder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getTva() { return tva; }
    public void setTva(String tva) { this.tva = tva; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public List<Client> getClients() { return clients; }
    public List<Chantier> getChantiers() { return chantiers; }
    public List<Produit> getProduits() { return produits; }
    public List<Intervention> getInterventions() { return interventions; }
    public List<UserSocieteRole> getUtilisateurs() { return utilisateurs; }

    public static final class Builder {
        private Long id;
        private String nom;
        private String tva;
        private String telephone;
        private String email;
        private String adresse;

        private Builder() {}

        public Builder id(Long id) { this.id = id; return this; }
        public Builder nom(String nom) { this.nom = nom; return this; }
        public Builder tva(String tva) { this.tva = tva; return this; }
        public Builder telephone(String telephone) { this.telephone = telephone; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder adresse(String adresse) { this.adresse = adresse; return this; }

        public Societe build() {
            return new Societe(id, nom, tva, telephone, email, adresse);
        }
    }
}