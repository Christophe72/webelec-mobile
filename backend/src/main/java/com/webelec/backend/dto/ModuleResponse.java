package com.webelec.backend.dto;

import com.webelec.backend.model.Module;

public class ModuleResponse {

    private Long id;
    private String nom;
    private String description;
    private String categorie;
    private String version;
    private boolean actif;

    public ModuleResponse() {}

    private ModuleResponse(Long id, String nom, String description, String categorie, String version, boolean actif) {
        this.id = id;
        this.nom = nom;
        this.description = description;
        this.categorie = categorie;
        this.version = version;
        this.actif = actif;
    }

    public static ModuleResponse from(Module entity) {
        return new ModuleResponse(
                entity.getId(),
                entity.getNom(),
                entity.getDescription(),
                entity.getCategorie(),
                entity.getVersion(),
                entity.isActif()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategorie() { return categorie; }
    public void setCategorie(String categorie) { this.categorie = categorie; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public boolean isActif() { return actif; }
    public void setActif(boolean actif) { this.actif = actif; }
}
