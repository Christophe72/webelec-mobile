package com.webelec.backend.model;

public enum UtilisateurRole {
    ADMIN,
    ARTISAN,
    TECH,
    AUDITEUR,
    GERANT,
    TECHNICIEN;

    public String canonicalName() {
        return switch (this) {
            case GERANT -> "ARTISAN";
            case TECHNICIEN -> "TECH";
            default -> name();
        };
    }

    public String authority() {
        return "ROLE_" + canonicalName();
    }

    public static String normalizeRole(String rawRole) {
        if (rawRole == null || rawRole.isBlank()) {
            return null;
        }
        String value = rawRole.trim().toUpperCase(java.util.Locale.ROOT);
        if (value.startsWith("ROLE_")) {
            value = value.substring("ROLE_".length());
        }
        try {
            return UtilisateurRole.valueOf(value).canonicalName();
        } catch (IllegalArgumentException ex) {
            return value;
        }
    }

    public static String toAuthority(String rawRole) {
        String normalized = normalizeRole(rawRole);
        if (normalized == null) {
            return null;
        }
        return "ROLE_" + normalized;
    }
}
