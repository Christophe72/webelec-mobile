package com.webelec.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "utilisateurs")
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;

    @Column(unique = true, nullable = false)
    private String email;

    private String motDePasse;

    @Enumerated(EnumType.STRING)
    private UtilisateurRole role;

    @ManyToOne
    @JoinColumn(name = "societe_id")
    private Societe societe;

    public Utilisateur() {}

    public Utilisateur(Long id, String nom, String prenom, String email,
                       String motDePasse, UtilisateurRole role, Societe societe) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.motDePasse = motDePasse;
        this.role = role;
        this.societe = societe;
    }

    public static Builder builder() { return new Builder(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMotDePasse() { return motDePasse; }
    public void setMotDePasse(String motDePasse) { this.motDePasse = motDePasse; }

    public UtilisateurRole getRole() { return role; }
    public void setRole(UtilisateurRole role) { this.role = role; }

    public Societe getSociete() { return societe; }
    public void setSociete(Societe societe) { this.societe = societe; }

    public static final class Builder {
        private Long id;
        private String nom;
        private String prenom;
        private String email;
        private String motDePasse;
        private UtilisateurRole role;
        private Societe societe;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder nom(String nom) { this.nom = nom; return this; }
        public Builder prenom(String prenom) { this.prenom = prenom; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder motDePasse(String motDePasse) { this.motDePasse = motDePasse; return this; }
        public Builder role(UtilisateurRole role) { this.role = role; return this; }
        public Builder societe(Societe societe) { this.societe = societe; return this; }

        public Utilisateur build() {
            return new Utilisateur(id, nom, prenom, email, motDePasse, role, societe);
        }
    }
}