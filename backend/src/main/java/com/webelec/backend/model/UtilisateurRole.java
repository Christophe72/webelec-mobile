package com.webelec.backend.model;

public enum UtilisateurRole {
    ADMIN,
    GERANT,
    TECHNICIEN;

    public String authority() {
        return "ROLE_" + name();
    }
}
