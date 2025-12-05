package com.webelec.backend.dto;

import com.webelec.backend.model.Chantier;
import com.webelec.backend.model.Client;
import com.webelec.backend.model.Societe;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ChantierRequest {

    @NotBlank(message = "Le nom du chantier est obligatoire")
    @Size(max = 255, message = "Le nom ne peut dépasser 255 caractères")
    private String nom;

    @Size(max = 512, message = "L'adresse ne peut dépasser 512 caractères")
    private String adresse;

    @Size(max = 1024, message = "La description ne peut dépasser 1024 caractères")
    private String description;

    @NotNull(message = "La société est obligatoire")
    private Long societeId;

    @NotNull(message = "Le client est obligatoire")
    private Long clientId;

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

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public Chantier toEntity() {
        Societe societe = new Societe();
        societe.setId(societeId);

        Client client = new Client();
        client.setId(clientId);

        return Chantier.builder()
                .nom(this.nom)
                .adresse(this.adresse)
                .description(this.description)
                .societe(societe)
                .client(client)
                .build();
    }
}