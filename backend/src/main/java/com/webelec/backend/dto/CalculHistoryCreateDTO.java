package com.webelec.backend.dto;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CalculHistoryCreateDTO {

    @NotNull(message = "chantierId est requis")
    private Long chantierId;

    @NotBlank(message = "calculatorType est requis")
    private String calculatorType;

    @NotNull(message = "inputs est requis")
    private JsonNode inputs;

    @NotNull(message = "results est requis")
    private JsonNode results;

    private String notes;

    public CalculHistoryCreateDTO() {}

    // Getters and Setters
    public Long getChantierId() { return chantierId; }
    public void setChantierId(Long chantierId) { this.chantierId = chantierId; }

    public String getCalculatorType() { return calculatorType; }
    public void setCalculatorType(String calculatorType) { this.calculatorType = calculatorType; }

    public JsonNode getInputs() { return inputs; }
    public void setInputs(JsonNode inputs) { this.inputs = inputs; }

    public JsonNode getResults() { return results; }
    public void setResults(JsonNode results) { this.results = results; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
