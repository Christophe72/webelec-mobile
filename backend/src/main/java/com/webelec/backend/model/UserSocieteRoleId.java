package com.webelec.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class UserSocieteRoleId implements Serializable {

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "societe_id")
    private Long societeId;

    public UserSocieteRoleId() {}

    public UserSocieteRoleId(Long userId, Long societeId) {
        this.userId = userId;
        this.societeId = societeId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getSocieteId() {
        return societeId;
    }

    public void setSocieteId(Long societeId) {
        this.societeId = societeId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserSocieteRoleId that = (UserSocieteRoleId) o;
        return Objects.equals(userId, that.userId) && Objects.equals(societeId, that.societeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, societeId);
    }
}
