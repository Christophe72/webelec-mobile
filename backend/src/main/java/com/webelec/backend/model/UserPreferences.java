package com.webelec.backend.model;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(
    name = "user_preferences",
    uniqueConstraints = @UniqueConstraint(columnNames = "user_id")
)
public class UserPreferences {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "preferences")
    private JsonNode preferences;

    public UserPreferences() {
    }

    public UserPreferences(Long userId, JsonNode preferences) {
        this.userId = userId;
        this.preferences = preferences;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public JsonNode getPreferences() {
        return preferences;
    }

    public void setPreferences(JsonNode preferences) {
        this.preferences = preferences;
    }
}
