package com.webelec.backend.dto;

import com.webelec.backend.model.Societe;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class SocieteRequest {

    @NotBlank(message = "Le nom de la société est obligatoire")
    @Size(max = 255, message = "Le nom ne peut dépasser 255 caractères")
    private String nom;

    @NotBlank(message = "La TVA est obligatoire")
    @Size(max = 32, message = "La TVA ne peut dépasser 32 caractères")
    private String tva;

    @Email(message = "Email invalide")
    @Size(max = 255, message = "L'email ne peut dépasser 255 caractères")
    private String email;

    @Pattern(regexp = "^[0-9+().\\/\\-\\s]{6,30}$", message = "Le numéro de téléphone est invalide")
    private String telephone;

    @Size(max = 512, message = "L'adresse ne peut dépasser 512 caractères")
    private String adresse;

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

    public Societe toEntity() {
        return Societe.builder()
                .nom(this.nom)
                .tva(this.tva)
                .email(this.email)
                .telephone(this.telephone)
                .adresse(this.adresse)
                .build();
    }
}