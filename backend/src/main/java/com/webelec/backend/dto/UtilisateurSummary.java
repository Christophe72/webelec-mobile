package com.webelec.backend.dto;

import com.webelec.backend.model.Utilisateur;

public class UtilisateurSummary {

    private Long id;
    private String nom;
    private String prenom;
    private String role;

    public UtilisateurSummary() {}

    public UtilisateurSummary(Long id, String nom, String prenom, String role) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.role = role;
    }

    public static UtilisateurSummary from(Utilisateur entity) {
        if (entity == null) {
            return null;
        }
        return new UtilisateurSummary(entity.getId(), entity.getNom(), entity.getPrenom(),
                entity.getRole() != null ? entity.getRole().name() : null);
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}