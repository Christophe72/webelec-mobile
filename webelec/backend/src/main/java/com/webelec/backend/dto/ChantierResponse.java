package com.webelec.backend.dto;

import com.webelec.backend.model.Chantier;

public class ChantierResponse {

    private Long id;
    private String nom;
    private String adresse;
    private String description;
    private Long societeId;

    public ChantierResponse() {
    }

    public ChantierResponse(Long id, String nom, String adresse, String description, Long societeId) {
        this.id = id;
        this.nom = nom;
        this.adresse = adresse;
        this.description = description;
        this.societeId = societeId;
    }

    public static ChantierResponse from(Chantier entity) {
        return new ChantierResponse(
                entity.getId(),
                entity.getNom(),
                entity.getAdresse(),
                entity.getDescription(),
                entity.getSociete() != null ? entity.getSociete().getId() : null
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

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getSocieteId() {
        return societeId;
    }

    public void setSocieteId(Long societeId) {
        this.societeId = societeId;
    }
}