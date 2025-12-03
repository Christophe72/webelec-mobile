package com.webelec.backend.dto;

import com.webelec.backend.model.Intervention;

import java.time.LocalDate;

public class InterventionResponse {

    private Long id;
    private String titre;
    private String description;
    private LocalDate dateIntervention;
    private SocieteSummary societe;
    private ChantierSummary chantier;
    private ClientSummary client;
    private UtilisateurSummary utilisateur;

    public InterventionResponse() {}

    private InterventionResponse(Long id, String titre, String description, LocalDate dateIntervention,
                                 SocieteSummary societe, ChantierSummary chantier,
                                 ClientSummary client, UtilisateurSummary utilisateur) {
        this.id = id;
        this.titre = titre;
        this.description = description;
        this.dateIntervention = dateIntervention;
        this.societe = societe;
        this.chantier = chantier;
        this.client = client;
        this.utilisateur = utilisateur;
    }

    public static InterventionResponse from(Intervention entity) {
        return new InterventionResponse(
                entity.getId(),
                entity.getTitre(),
                entity.getDescription(),
                entity.getDateIntervention(),
                SocieteSummary.from(entity.getSociete()),
                ChantierSummary.from(entity.getChantier()),
                ClientSummary.from(entity.getClient()),
                UtilisateurSummary.from(entity.getUtilisateur())
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getDateIntervention() { return dateIntervention; }
    public void setDateIntervention(LocalDate dateIntervention) { this.dateIntervention = dateIntervention; }
    public SocieteSummary getSociete() { return societe; }
    public void setSociete(SocieteSummary societe) { this.societe = societe; }
    public ChantierSummary getChantier() { return chantier; }
    public void setChantier(ChantierSummary chantier) { this.chantier = chantier; }
    public ClientSummary getClient() { return client; }
    public void setClient(ClientSummary client) { this.client = client; }
    public UtilisateurSummary getUtilisateur() { return utilisateur; }
    public void setUtilisateur(UtilisateurSummary utilisateur) { this.utilisateur = utilisateur; }
}