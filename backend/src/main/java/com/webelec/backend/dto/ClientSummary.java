package com.webelec.backend.dto;

import com.webelec.backend.model.Client;

public class ClientSummary {

    private Long id;
    private String nom;
    private String prenom;

    public ClientSummary() {}

    public ClientSummary(Long id, String nom, String prenom) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
    }

    public static ClientSummary from(Client entity) {
        if (entity == null) {
            return null;
        }
        return new ClientSummary(entity.getId(), entity.getNom(), entity.getPrenom());
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
}
