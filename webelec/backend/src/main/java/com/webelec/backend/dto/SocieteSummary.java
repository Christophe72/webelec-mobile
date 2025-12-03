package com.webelec.backend.dto;

import com.webelec.backend.model.Societe;

public class SocieteSummary {

    private Long id;
    private String nom;

    public SocieteSummary() {}

    public SocieteSummary(Long id, String nom) {
        this.id = id;
        this.nom = nom;
    }

    public static SocieteSummary from(Societe entity) {
        if (entity == null) {
            return null;
        }
        return new SocieteSummary(entity.getId(), entity.getNom());
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
