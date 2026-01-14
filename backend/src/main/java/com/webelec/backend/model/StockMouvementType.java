package com.webelec.backend.model;

public enum StockMouvementType {
    IN("in"),
    OUT("out");

    private final String apiValue;

    StockMouvementType(String apiValue) {
        this.apiValue = apiValue;
    }

    public String getApiValue() {
        return apiValue;
    }

    public static StockMouvementType fromApi(String value) {
        if (value == null) {
            throw new IllegalArgumentException("Le type de mouvement est obligatoire");
        }
        String normalized = value.trim().toLowerCase();
        return switch (normalized) {
            case "in" -> IN;
            case "out" -> OUT;
            default -> throw new IllegalArgumentException("Type de mouvement invalide: " + value);
        };
    }
}
