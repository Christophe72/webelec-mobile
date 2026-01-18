package com.webelec.backend.dto;

// Simple DTO sans Lombok pour éviter la dépendance à l'annotation processing
public class UblDTO {
    private String contenu;
    private Long factureId;

    public UblDTO() {
    }

    public UblDTO(String contenu, Long factureId) {
        this.contenu = contenu;
        this.factureId = factureId;
    }

    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }

    public Long getFactureId() {
        return factureId;
    }

    public void setFactureId(Long factureId) {
        this.factureId = factureId;
    }
}