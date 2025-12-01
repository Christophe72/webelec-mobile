package com.webelec.backend.dto;

import com.webelec.backend.model.Client;
import com.webelec.backend.model.Societe;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ClientRequest {

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 255, message = "Le nom ne peut dépasser 255 caractères")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(max = 255, message = "Le prénom ne peut dépasser 255 caractères")
    private String prenom;

    @Email(message = "Email invalide")
    @Size(max = 255, message = "L'email ne peut dépasser 255 caractères")
    private String email;

    @Pattern(regexp = "^[0-9+().\\/\\-\\s]{6,30}$", message = "Le numéro de téléphone est invalide")
    private String telephone;

    @Size(max = 512, message = "L'adresse ne peut dépasser 512 caractères")
    private String adresse;

    @NotNull(message = "La société est obligatoire")
    private Long societeId;

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

    public Long getSocieteId() {
        return societeId;
    }

    public void setSocieteId(Long societeId) {
        this.societeId = societeId;
    }

    public Client toEntity() {
        Societe societe = new Societe();
        societe.setId(societeId);

        return Client.builder()
                .nom(this.nom)
                .prenom(this.prenom)
                .email(this.email)
                .telephone(this.telephone)
                .adresse(this.adresse)
                .societe(societe)
                .build();
    }
}
