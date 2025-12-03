package com.webelec.backend.dto;

import com.webelec.backend.model.Client;

public class ClientResponse {

    private Long id;
    private String nom;
    private String prenom;
    private String telephone;
    private String adresse;
    private SocieteSummary societe;

    public ClientResponse() {}

    private ClientResponse(Long id, String nom, String prenom, String telephone,
                           String adresse, SocieteSummary societe) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.telephone = telephone;
        this.adresse = adresse;
        this.societe = societe;
    }

    public static ClientResponse from(Client entity) {
        return new ClientResponse(
                entity.getId(),
                entity.getNom(),
                entity.getPrenom(),
                entity.getTelephone(),
                entity.getAdresse(),
                SocieteSummary.from(entity.getSociete())
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }
    public SocieteSummary getSociete() { return societe; }
    public void setSociete(SocieteSummary societe) { this.societe = societe; }
}