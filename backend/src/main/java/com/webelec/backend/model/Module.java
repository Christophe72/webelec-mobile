package com.webelec.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "modules")
public class Module {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String nom;

    @Column(length = 1024)
    private String description;

    @Column(length = 255)
    private String categorie;

    @Column(length = 255)
    private String version;

    @Column(nullable = false)
    private boolean actif = true;

    public Module() {}

    public Module(Long id, String nom, String description, String categorie, String version, boolean actif) {
        this.id = id;
        this.nom = nom;
        this.description = description;
        this.categorie = categorie;
        this.version = version;
        this.actif = actif;
    }

    public static Builder builder() { return new Builder(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategorie() { return categorie; }
    public void setCategorie(String categorie) { this.categorie = categorie; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public boolean isActif() { return actif; }
    public void setActif(boolean actif) { this.actif = actif; }

    public static final class Builder {
        private Long id;
        private String nom;
        private String description;
        private String categorie;
        private String version;
        private boolean actif = true;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder nom(String nom) { this.nom = nom; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder categorie(String categorie) { this.categorie = categorie; return this; }
        public Builder version(String version) { this.version = version; return this; }
        public Builder actif(boolean actif) { this.actif = actif; return this; }

        public Module build() {
            return new Module(id, nom, description, categorie, version, actif);
        }
    }
}
