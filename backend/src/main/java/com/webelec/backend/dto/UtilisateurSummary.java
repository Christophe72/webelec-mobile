package com.webelec.backend.dto;

import com.webelec.backend.model.UserSocieteRole;
import com.webelec.backend.model.Utilisateur;

public class UtilisateurSummary {

    private Long id;
    private String nom;
    private String prenom;
    private Long societeId;
    private String societeNom;
    private String role;

    public UtilisateurSummary() {}

    public UtilisateurSummary(Long id, String nom, String prenom, Long societeId, String societeNom, String role) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.societeId = societeId;
        this.societeNom = societeNom;
        this.role = role;
    }

    public UtilisateurSummary(Long id2, String nom2, String prenom2, Object object) {
		// TODO Auto-generated constructor stub
	}

	public static UtilisateurSummary from(Utilisateur entity) {
        if (entity == null) {
            return null;
        }
        // Prendre la première société et le rôle associé si présents
        Long societeId = null;
        String societeNom = null;
        String role = null;
        if (entity.getSocietes() != null && !entity.getSocietes().isEmpty()) {
            var us = entity.getSocietes().get(0);
            if (us.getSociete() != null) {
                societeId = us.getSociete().getId();
                societeNom = us.getSociete().getNom();
            }
            if (us.getRole() != null) {
                role = us.getRole().canonicalName();
            }
        } else if (entity.getRole() != null) {
            role = entity.getRole().canonicalName();
        }
        return new UtilisateurSummary(entity.getId(), entity.getNom(), entity.getPrenom(), societeId, societeNom, role);
    }

    public static UtilisateurSummary from(UserSocieteRole link) {
        if (link == null) {
            return null;
        }
        Utilisateur utilisateur = link.getUtilisateur();
        return new UtilisateurSummary(
                utilisateur != null ? utilisateur.getId() : null,
                utilisateur != null ? utilisateur.getNom() : null,
                utilisateur != null ? utilisateur.getPrenom() : null,
                link.getSociete() != null ? link.getSociete().getId() : null,
                link.getSociete() != null ? link.getSociete().getNom() : null,
                link.getRole() != null ? link.getRole().canonicalName() : null
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

    public Long getSocieteId() {
        return societeId;
    }

    public void setSocieteId(Long societeId) {
        this.societeId = societeId;
    }

    public String getSocieteNom() {
        return societeNom;
    }

    public void setSocieteNom(String societeNom) {
        this.societeNom = societeNom;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
