package com.webelec.backend.dto;

import com.webelec.backend.model.Chantier;

public class ChantierSummary {

    private Long id;
    private String nom;

    public ChantierSummary() {}

    public ChantierSummary(Long id, String nom) {
        this.id = id;
        this.nom = nom;
    }

    public static ChantierSummary from(Chantier entity) {
        if (entity == null) {
            return null;
        }
        return new ChantierSummary(entity.getId(), entity.getNom());
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
}
