package com.webelec.backend.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.webelec.backend.model.CalculHistory;
import java.time.LocalDateTime;

public class CalculHistoryDTO {

    private Long id;
    private Long userId;
    private Long chantierId;
    private String calculatorType;
    private JsonNode inputs;
    private JsonNode results;
    private String notes;
    private LocalDateTime createdAt;

    public CalculHistoryDTO() {}

    private CalculHistoryDTO(Long id, Long userId, Long chantierId, String calculatorType,
                             JsonNode inputs, JsonNode results, String notes, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.chantierId = chantierId;
        this.calculatorType = calculatorType;
        this.inputs = inputs;
        this.results = results;
        this.notes = notes;
        this.createdAt = createdAt;
    }

    public static CalculHistoryDTO from(CalculHistory entity) {
        return new CalculHistoryDTO(
                entity.getId(),
                entity.getUserId(),
                entity.getChantierId(),
                entity.getCalculatorType(),
                entity.getInputs(),
                entity.getResults(),
                entity.getNotes(),
                entity.getCreatedAt()
        );
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
