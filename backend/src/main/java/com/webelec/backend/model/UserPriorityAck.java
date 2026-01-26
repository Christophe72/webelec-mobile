package com.webelec.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.Instant;

@Entity
@Table(
    name = "user_priority_ack",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "priority_id"})
)
public class UserPriorityAck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "priority_id", nullable = false)
    private String priorityId;

    @Column(name = "acknowledged_at", nullable = false, updatable = false)
    private Instant acknowledgedAt;

    public UserPriorityAck() {
    }

    public UserPriorityAck(Long userId, String priorityId) {
        this.userId = userId;
        this.priorityId = priorityId;
    }

    @PrePersist
    void onCreate() {
        if (acknowledgedAt == null) {
            acknowledgedAt = Instant.now();
        }
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

    public String getPriorityId() {
        return priorityId;
    }

    public void setPriorityId(String priorityId) {
        this.priorityId = priorityId;
    }

    public Instant getAcknowledgedAt() {
        return acknowledgedAt;
    }

    public void setAcknowledgedAt(Instant acknowledgedAt) {
        this.acknowledgedAt = acknowledgedAt;
    }
}
