package com.webelec.backend.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class LegalDocumentReadyRequest {

    @NotNull(message = "L'identifiant userSociete est obligatoire")
    private UUID userSocieteId;

    public UUID getUserSocieteId() {
        return userSocieteId;
    }

    public void setUserSocieteId(UUID userSocieteId) {
        this.userSocieteId = userSocieteId;
    }
}
