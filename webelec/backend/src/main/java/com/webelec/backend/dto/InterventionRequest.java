package com.webelec.backend.dto;

import com.webelec.backend.model.Chantier;
import com.webelec.backend.model.Client;
import com.webelec.backend.model.Intervention;
import com.webelec.backend.model.Societe;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class InterventionRequest {

    @NotBlank(message = "Le titre est obligatoire")
    @Size(max = 255, message = "Le titre ne peut dépasser 255 caractères")
    private String titre;

    @Size(max = 1024, message = "La description ne peut dépasser 1024 caractères")
    private String description;

    @NotNull(message = "La date d'intervention est obligatoire")
    private LocalDate dateIntervention;

    @NotNull(message = "La société est obligatoire")
    private Long societeId;

    @NotNull(message = "Le chantier est obligatoire")
    private Long chantierId;

    @NotNull(message = "Le client est obligatoire")
    private Long clientId;

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

    public Intervention toEntity() {
        Societe societe = new Societe();
        societe.setId(societeId);

        Chantier chantier = new Chantier();
        chantier.setId(chantierId);

        Client client = new Client();
        client.setId(clientId);

        return Intervention.builder()
                .titre(this.titre)
                .description(this.description)
                .dateIntervention(this.dateIntervention)
                .societe(societe)
                .chantier(chantier)
                .client(client)
                .build();
    }
}
