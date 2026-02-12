package com.webelec.backend.model;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "calcul_history")
public class CalculHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "chantier_id")
    private Long chantierId;

    @Column(name = "calculator_type", nullable = false, length = 50)
    private String calculatorType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "inputs", nullable = false)
    private JsonNode inputs;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "results", nullable = false)
    private JsonNode results;

    @Column(name = "notes", length = 1024)
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public CalculHistory() {}

    public CalculHistory(Long id, Long userId, Long chantierId, String calculatorType,
                         JsonNode inputs, JsonNode results, String notes) {
        this.id = id;
        this.userId = userId;
        this.chantierId = chantierId;
        this.calculatorType = calculatorType;
        this.inputs = inputs;
        this.results = results;
        this.notes = notes;
    }

    public static Builder builder() { return new Builder(); }

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

    // Builder Pattern
    public static class Builder {
        private Long id;
        private Long userId;
        private Long chantierId;
        private String calculatorType;
        private JsonNode inputs;
        private JsonNode results;
        private String notes;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public Builder chantierId(Long chantierId) {
            this.chantierId = chantierId;
            return this;
        }

        public Builder calculatorType(String calculatorType) {
            this.calculatorType = calculatorType;
            return this;
        }

        public Builder inputs(JsonNode inputs) {
            this.inputs = inputs;
            return this;
        }

        public Builder results(JsonNode results) {
            this.results = results;
            return this;
        }

        public Builder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public CalculHistory build() {
            return new CalculHistory(id, userId, chantierId, calculatorType, inputs, results, notes);
        }
    }
}
