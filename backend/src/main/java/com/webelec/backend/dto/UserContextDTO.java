package com.webelec.backend.dto;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class UserContextDTO {

    private Long userId;
    private String fullName;
    private String email;
    private String role;
    private TeamAssignmentDTO team;
    private List<RgieHabilitationDTO> habilitations = new ArrayList<>();
    private NotificationSummaryDTO notifications;

    public UserContextDTO() {
    }

    private UserContextDTO(Long userId, String fullName, String email, String role,
                           TeamAssignmentDTO team, List<RgieHabilitationDTO> habilitations,
                           NotificationSummaryDTO notifications) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.team = team;
        this.habilitations = habilitations != null ? habilitations : Collections.emptyList();
        this.notifications = notifications;
    }

    public static Builder builder() {
        return new Builder();
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public TeamAssignmentDTO getTeam() {
        return team;
    }

    public void setTeam(TeamAssignmentDTO team) {
        this.team = team;
    }

    public List<RgieHabilitationDTO> getHabilitations() {
        return Collections.unmodifiableList(habilitations);
    }

    public void setHabilitations(List<RgieHabilitationDTO> habilitations) {
        this.habilitations = habilitations != null ? new ArrayList<>(habilitations) : new ArrayList<>();
    }

    public NotificationSummaryDTO getNotifications() {
        return notifications;
    }

    public void setNotifications(NotificationSummaryDTO notifications) {
        this.notifications = notifications;
    }

    public static final class Builder {
        private Long userId;
        private String fullName;
        private String email;
        private String role;
        private TeamAssignmentDTO team;
        private List<RgieHabilitationDTO> habilitations = new ArrayList<>();
        private NotificationSummaryDTO notifications;

        private Builder() {
        }

        public Builder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public Builder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder role(String role) {
            this.role = role;
            return this;
        }

        public Builder team(TeamAssignmentDTO team) {
            this.team = team;
            return this;
        }

        public Builder habilitations(List<RgieHabilitationDTO> habilitations) {
            if (habilitations != null) {
                this.habilitations = new ArrayList<>(habilitations);
            }
            return this;
        }

        public Builder notifications(NotificationSummaryDTO notifications) {
            this.notifications = notifications;
            return this;
        }

        public UserContextDTO build() {
            return new UserContextDTO(userId, fullName, email, role, team,
                    new ArrayList<>(habilitations), notifications);
        }
    }
}
