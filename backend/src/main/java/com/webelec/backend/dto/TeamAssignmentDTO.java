package com.webelec.backend.dto;

import java.time.LocalDate;

public class TeamAssignmentDTO {

    private Long teamId;
    private String teamName;
    private LocalDate assignedAt;

    public TeamAssignmentDTO() {
    }

    public TeamAssignmentDTO(Long teamId, String teamName, LocalDate assignedAt) {
        this.teamId = teamId;
        this.teamName = teamName;
        this.assignedAt = assignedAt;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public LocalDate getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(LocalDate assignedAt) {
        this.assignedAt = assignedAt;
    }
}
