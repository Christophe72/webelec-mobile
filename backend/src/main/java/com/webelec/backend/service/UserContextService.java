package com.webelec.backend.service;

import com.webelec.backend.dto.NotificationSummaryDTO;
import com.webelec.backend.dto.RgieHabilitationDTO;
import com.webelec.backend.dto.RgieHabilitationStatus;
import com.webelec.backend.dto.TeamAssignmentDTO;
import com.webelec.backend.dto.UserContextDTO;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.RgieHabilitation;
import com.webelec.backend.model.TechnicianTeamAssignment;
import com.webelec.backend.model.UserSocieteRole;
import com.webelec.backend.model.Utilisateur;
import com.webelec.backend.repository.RgieHabilitationRepository;
import com.webelec.backend.repository.TechnicianTeamAssignmentRepository;
import com.webelec.backend.repository.UserNotificationRepository;
import com.webelec.backend.repository.UtilisateurRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class UserContextService {

    private final UtilisateurRepository utilisateurRepository;
    private final RgieHabilitationRepository rgieHabilitationRepository;
    private final TechnicianTeamAssignmentRepository technicianTeamAssignmentRepository;
    private final UserNotificationRepository userNotificationRepository;

    public UserContextService(UtilisateurRepository utilisateurRepository,
                              RgieHabilitationRepository rgieHabilitationRepository,
                              TechnicianTeamAssignmentRepository technicianTeamAssignmentRepository,
                              UserNotificationRepository userNotificationRepository) {
        this.utilisateurRepository = utilisateurRepository;
        this.rgieHabilitationRepository = rgieHabilitationRepository;
        this.technicianTeamAssignmentRepository = technicianTeamAssignmentRepository;
        this.userNotificationRepository = userNotificationRepository;
    }

    public UserContextDTO getContext(Long utilisateurId) {
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new ResourceNotFoundException("Technicien non trouvé"));

        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        List<RgieHabilitationDTO> habilitations = rgieHabilitationRepository.findByUtilisateurId(utilisateurId).stream()
                .map(entity -> toDto(entity, today))
                .toList();

        TeamAssignmentDTO teamAssignment = technicianTeamAssignmentRepository
                .findFirstByUtilisateurIdAndEndedAtIsNullOrderByAssignedAtDesc(utilisateurId)
                .map(this::toDto)
                .orElse(null);

        long unreadNotifications = userNotificationRepository.countByUtilisateurIdAndReadFalse(utilisateurId);
        long criticalNotifications = habilitations.stream()
                .filter(dto -> dto.getStatus() == RgieHabilitationStatus.TO_RENEW
                        || dto.getStatus() == RgieHabilitationStatus.EXPIRED)
                .count();

        NotificationSummaryDTO notificationSummary = new NotificationSummaryDTO(
                unreadNotifications,
                criticalNotifications
        );

        return UserContextDTO.builder()
                .userId(utilisateur.getId())
                .fullName(buildFullName(utilisateur))
                .email(utilisateur.getEmail())
                .role(resolveRole(utilisateur))
                .team(teamAssignment)
                .habilitations(habilitations)
                .notifications(notificationSummary)
                .build();
    }

    private RgieHabilitationDTO toDto(RgieHabilitation entity, LocalDate referenceDate) {
        RgieHabilitationStatus status = computeStatus(entity.getValidUntil(), referenceDate);
        return new RgieHabilitationDTO(
                entity.getId(),
                entity.getLabel(),
                entity.getCertificateNumber(),
                entity.getAuthorityLevel(),
                entity.getValidFrom(),
                entity.getValidUntil(),
                status
        );
    }

    private TeamAssignmentDTO toDto(TechnicianTeamAssignment assignment) {
        if (assignment == null) {
            return null;
        }
        var team = assignment.getTeam();
        Long teamId = team != null ? team.getId() : null;
        String teamName = team != null ? team.getName() : null;
        return new TeamAssignmentDTO(teamId, teamName, assignment.getAssignedAt());
    }

    private RgieHabilitationStatus computeStatus(LocalDate validUntil, LocalDate referenceDate) {
        if (validUntil == null) {
            return RgieHabilitationStatus.VALID;
        }
        if (validUntil.isBefore(referenceDate)) {
            return RgieHabilitationStatus.EXPIRED;
        }
        if (!validUntil.isAfter(referenceDate.plusDays(30))) {
            return RgieHabilitationStatus.TO_RENEW;
        }
        return RgieHabilitationStatus.VALID;
    }

    private String resolveRole(Utilisateur utilisateur) {
        List<UserSocieteRole> societes = Optional.ofNullable(utilisateur.getSocietes())
                .orElse(Collections.emptyList());
        return societes.stream()
                .map(UserSocieteRole::getRole)
                .filter(Objects::nonNull)
                .findFirst()
                .or(() -> Optional.ofNullable(utilisateur.getRole()))
                .map(Enum::name)
                .orElse(null);
    }

    private String buildFullName(Utilisateur utilisateur) {
        return java.util.stream.Stream.of(utilisateur.getPrenom(), utilisateur.getNom())
                .filter(part -> part != null && !part.isBlank())
                .collect(Collectors.joining(" "));
    }
}
