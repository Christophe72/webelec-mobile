package com.webelec.backend.dto;

import com.fasterxml.jackson.databind.JsonNode;

public class CalculateurPreferencesDTO {

    private JsonNode preferences;

    public CalculateurPreferencesDTO() {}

    public CalculateurPreferencesDTO(JsonNode preferences) {
        this.preferences = preferences;
    }

    public JsonNode getPreferences() { return preferences; }
    public void setPreferences(JsonNode preferences) { this.preferences = preferences; }
}
