package com.webelec.backend.dto;

import com.webelec.backend.model.Societe;

public class SocieteResponse {

    private Long id;
    private String nom;
    private String tva;
    private String email;
    private String telephone;
    private String adresse;

    public SocieteResponse() {
    }

    public SocieteResponse(Long id, String nom, String tva, String email, String telephone, String adresse) {
        this.id = id;
        this.nom = nom;
        this.tva = tva;
        this.email = email;
        this.telephone = telephone;
        this.adresse = adresse;
    }

    public static SocieteResponse from(Societe entity) {
        return new SocieteResponse(
                entity.getId(),
                entity.getNom(),
                entity.getTva(),
                entity.getEmail(),
                entity.getTelephone(),
                entity.getAdresse()
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

    public String getTva() {
        return tva;
    }

    public void setTva(String tva) {
        this.tva = tva;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }
}