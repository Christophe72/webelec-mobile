package com.webelec.backend.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "user_societes")
public class UserSocieteRole implements Serializable {
    @EmbeddedId
    private UserSocieteRoleId id = new UserSocieteRoleId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private Utilisateur utilisateur;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("societeId")
    @JoinColumn(name = "societe_id")
    private Societe societe;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 50)
    private UtilisateurRole role;

    public UserSocieteRole() {}

    public UserSocieteRole(Utilisateur utilisateur, Societe societe, UtilisateurRole role) {
        this.utilisateur = utilisateur;
        this.societe = societe;
        this.role = role;
        if (utilisateur != null && societe != null) {
            this.id = new UserSocieteRoleId(utilisateur.getId(), societe.getId());
        }
    }

    public UserSocieteRoleId getId() { return id; }
    public void setId(UserSocieteRoleId id) { this.id = id; }

    public Utilisateur getUtilisateur() { return utilisateur; }
    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
        if (utilisateur != null && societe != null) {
            this.id = new UserSocieteRoleId(utilisateur.getId(), societe.getId());
        }
    }

    public Societe getSociete() { return societe; }
    public void setSociete(Societe societe) {
        this.societe = societe;
        if (utilisateur != null && societe != null) {
            this.id = new UserSocieteRoleId(utilisateur.getId(), societe.getId());
        }
    }

    public UtilisateurRole getRole() { return role; }
    public void setRole(UtilisateurRole role) { this.role = role; }
}