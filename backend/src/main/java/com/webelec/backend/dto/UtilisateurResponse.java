package com.webelec.backend.dto;

import com.webelec.backend.model.Utilisateur;

public class UtilisateurResponse {

    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String role;
    private SocieteSummary societe;

    public UtilisateurResponse() {}

    private UtilisateurResponse(Long id, String nom, String prenom, String email,
                                String role, SocieteSummary societe) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.role = role;
        this.societe = societe;
    }

    public static UtilisateurResponse from(Utilisateur entity) {
        return new UtilisateurResponse(
                entity.getId(),
                entity.getNom(),
                entity.getPrenom(),
                entity.getEmail(),
                entity.getRole() != null ? entity.getRole().name() : null,
                entity.getSociete() != null ? SocieteSummary.from(entity.getSociete()) : null
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public SocieteSummary getSociete() {
        return societe;
    }

    public void setSociete(SocieteSummary societe) {
        this.societe = societe;
    }
}