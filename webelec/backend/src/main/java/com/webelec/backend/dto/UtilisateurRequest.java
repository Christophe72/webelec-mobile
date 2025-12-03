package com.webelec.backend.dto;

import com.webelec.backend.model.Societe;
import com.webelec.backend.model.Utilisateur;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UtilisateurRequest {

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 255, message = "Le nom ne peut dépasser 255 caractères")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(max = 255, message = "Le prénom ne peut dépasser 255 caractères")
    private String prenom;

    @Email(message = "Email invalide")
    @Size(max = 255, message = "L'email ne peut dépasser 255 caractères")
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 6, max = 255, message = "Le mot de passe doit contenir entre 6 et 255 caractères")
    private String motDePasse;

    @NotBlank(message = "Le rôle est obligatoire")
    @Size(max = 100, message = "Le rôle ne peut dépasser 100 caractères")
    private String role;

    @NotNull(message = "L'identifiant de la société est obligatoire")
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

    public String getMotDePasse() {
        return motDePasse;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getSocieteId() {
        return societeId;
    }

    public void setSocieteId(Long societeId) {
        this.societeId = societeId;
    }

    public Utilisateur toEntity() {
        Societe societe = new Societe();
        societe.setId(this.societeId);

        return Utilisateur.builder()
                .nom(this.nom)
                .prenom(this.prenom)
                .email(this.email)
                .motDePasse(this.motDePasse)
                .role(this.role)
                .societe(societe)
                .build();
    }
}
