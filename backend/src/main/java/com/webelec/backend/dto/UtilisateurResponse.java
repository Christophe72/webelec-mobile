package com.webelec.backend.dto;

import com.webelec.backend.model.Utilisateur;
import java.util.List;
import java.util.stream.Collectors;

public class UtilisateurResponse {

    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private List<UtilisateurSummary> societes;

    public UtilisateurResponse() {}

    private UtilisateurResponse(Long id, String nom, String prenom, String email,
                                List<UtilisateurSummary> societes) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.societes = societes;
    }

    public static UtilisateurResponse from(Utilisateur entity) {
        List<UtilisateurSummary> societes = entity.getSocietes().stream()
                .map(UtilisateurSummary::from)
                .collect(Collectors.toList());
        return new UtilisateurResponse(
                entity.getId(),
                entity.getNom(),
                entity.getPrenom(),
                entity.getEmail(),
                societes
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

    public List<UtilisateurSummary> getSocietes() {
        return societes;
    }

    public void setSocietes(List<UtilisateurSummary> societes) {
        this.societes = societes;
    }
}