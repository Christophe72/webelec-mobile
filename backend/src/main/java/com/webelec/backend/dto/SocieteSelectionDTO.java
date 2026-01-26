package com.webelec.backend.dto;

import com.webelec.backend.service.context.UserContext;

import java.time.Instant;

public class SocieteSelectionDTO {

    private Long societeId;
    private String societeName;
    private String role;
    private Instant selectedAt;

    public SocieteSelectionDTO() {
    }

    public SocieteSelectionDTO(Long societeId, String societeName, String role, Instant selectedAt) {
        this.societeId = societeId;
        this.societeName = societeName;
        this.role = role;
        this.selectedAt = selectedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static SocieteSelectionDTO from(UserContext.Selection selection) {
        if (selection == null) {
            return null;
        }
        return new SocieteSelectionDTO(
                selection.societeId(),
                selection.societeName(),
                selection.role() != null ? selection.role().name() : null,
                selection.selectedAt()
        );
    }

    public Long getSocieteId() {
        return societeId;
    }

    public void setSocieteId(Long societeId) {
        this.societeId = societeId;
    }

    public String getSocieteName() {
        return societeName;
    }

    public void setSocieteName(String societeName) {
        this.societeName = societeName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Instant getSelectedAt() {
        return selectedAt;
    }

    public void setSelectedAt(Instant selectedAt) {
        this.selectedAt = selectedAt;
    }

    public static final class Builder {
        private Long societeId;
        private String societeName;
        private String role;
        private Instant selectedAt;

        private Builder() {
        }

        public Builder societeId(Long societeId) {
            this.societeId = societeId;
            return this;
        }

        public Builder societeName(String societeName) {
            this.societeName = societeName;
            return this;
        }

        public Builder role(String role) {
            this.role = role;
            return this;
        }

        public Builder selectedAt(Instant selectedAt) {
            this.selectedAt = selectedAt;
            return this;
        }

        public SocieteSelectionDTO build() {
            return new SocieteSelectionDTO(societeId, societeName, role, selectedAt);
        }
    }
}
