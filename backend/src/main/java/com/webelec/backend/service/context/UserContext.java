package com.webelec.backend.service.context;

import com.webelec.backend.dto.RgieHabilitationStatus;
import com.webelec.backend.model.UtilisateurRole;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record UserContext(
        Long userId,
        String fullName,
        String email,
        Selection selection,
        TeamAssignment team,
        List<Habilitation> habilitations,
        NotificationSummary notifications
) {
    public UserContext {
        habilitations = habilitations == null ? List.of() : List.copyOf(habilitations);
    }

    public String role() {
        return selection != null && selection.role() != null
                ? selection.role().name()
                : null;
    }

    public record Selection(
            Long societeId,
            String societeName,
            UtilisateurRole role,
            Instant selectedAt
    ) { }

    public record TeamAssignment(
            Long teamId,
            String teamName,
            LocalDate assignedAt
    ) { }

    public record Habilitation(
            Long id,
            String label,
            String certificateNumber,
            String authorityLevel,
            LocalDate validFrom,
            LocalDate validUntil,
            RgieHabilitationStatus status
    ) { }

    public record NotificationSummary(
            long unreadCount,
            long criticalCount
    ) { }
}
