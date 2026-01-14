package com.webelec.backend.dto;

import jakarta.validation.constraints.Size;

public class ModuleUpdateRequest {

    @Size(max = 255, message = "Le nom ne peut dépasser 255 caractères")
    private String nom;

    @Size(max = 1024, message = "La description ne peut dépasser 1024 caractères")
    private String description;

    @Size(max = 255, message = "La catégorie ne peut dépasser 255 caractères")
    private String categorie;

    @Size(max = 255, message = "La version ne peut dépasser 255 caractères")
    private String version;

    private Boolean actif;

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategorie() { return categorie; }
    public void setCategorie(String categorie) { this.categorie = categorie; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public Boolean getActif() { return actif; }
    public void setActif(Boolean actif) { this.actif = actif; }
}
