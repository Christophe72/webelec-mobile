package com.webelec.backend.dto;

import com.webelec.backend.model.Intervention;

import java.time.LocalDate;

public class InterventionResponse {

    private Long id;
    private String titre;
    private String description;
    private LocalDate dateIntervention;
    private Long societeId;
    private Long chantierId;
    private Long clientId;

    public InterventionResponse() {
    }

    public InterventionResponse(Long id, String titre, String description, LocalDate dateIntervention,
                                Long societeId, Long chantierId, Long clientId) {
        this.id = id;
        this.titre = titre;
        this.description = description;
        this.dateIntervention = dateIntervention;
        this.societeId = societeId;
        this.chantierId = chantierId;
        this.clientId = clientId;
    }

    public static InterventionResponse from(Intervention entity) {
        return new InterventionResponse(
                entity.getId(),
                entity.getTitre(),
                entity.getDescription(),
                entity.getDateIntervention(),
                entity.getSociete() != null ? entity.getSociete().getId() : null,
                entity.getChantier() != null ? entity.getChantier().getId() : null,
                entity.getClient() != null ? entity.getClient().getId() : null
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDateIntervention() {
        return dateIntervention;
    }

    public void setDateIntervention(LocalDate dateIntervention) {
        this.dateIntervention = dateIntervention;
    }

    public Long getSocieteId() {
        return societeId;
    }

    public void setSocieteId(Long societeId) {
        this.societeId = societeId;
    }

    public Long getChantierId() {
        return chantierId;
    }

    public void setChantierId(Long chantierId) {
        this.chantierId = chantierId;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }
}