package com.webelec.backend.dto;

import com.webelec.backend.model.Chantier;

public class ChantierResponse {

    private Long id;
    private String nom;
    private String adresse;
    private String description;
    private SocieteSummary societe;
    private ClientSummary client;

    public ChantierResponse() {}

    private ChantierResponse(Long id, String nom, String adresse, String description,
                             SocieteSummary societe, ClientSummary client) {
        this.id = id;
        this.nom = nom;
        this.adresse = adresse;
        this.description = description;
        this.societe = societe;
        this.client = client;
    }

    public static ChantierResponse from(Chantier entity) {
        return new ChantierResponse(
                entity.getId(),
                entity.getNom(),
                entity.getAdresse(),
                entity.getDescription(),
                SocieteSummary.from(entity.getSociete()),
                ClientSummary.from(entity.getClient())
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public SocieteSummary getSociete() { return societe; }
    public void setSociete(SocieteSummary societe) { this.societe = societe; }
    public ClientSummary getClient() { return client; }
    public void setClient(ClientSummary client) { this.client = client; }
}