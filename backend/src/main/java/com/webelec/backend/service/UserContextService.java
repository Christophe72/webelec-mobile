package com.webelec.backend.service;

import com.webelec.backend.dto.RgieHabilitationStatus;
import com.webelec.backend.dto.UserContextDTO;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.RgieHabilitation;
import com.webelec.backend.model.SocieteSelection;
import com.webelec.backend.model.TechnicianTeamAssignment;
import com.webelec.backend.model.UserSocieteRole;
import com.webelec.backend.model.Utilisateur;
import com.webelec.backend.repository.RgieHabilitationRepository;
import com.webelec.backend.repository.SocieteSelectionRepository;
import com.webelec.backend.repository.TechnicianTeamAssignmentRepository;
import com.webelec.backend.repository.UserNotificationRepository;
import com.webelec.backend.repository.UtilisateurRepository;
import com.webelec.backend.service.context.UserContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class UserContextService {

    private final UtilisateurRepository utilisateurRepository;
        private final RgieHabilitationRepository rgieHabilitationRepository;
        private final SocieteSelectionRepository societeSelectionRepository;
    private final TechnicianTeamAssignmentRepository technicianTeamAssignmentRepository;
    private final UserNotificationRepository userNotificationRepository;

    public UserContextService(UtilisateurRepository utilisateurRepository,
                              RgieHabilitationRepository rgieHabilitationRepository,
                      SocieteSelectionRepository societeSelectionRepository,
                              TechnicianTeamAssignmentRepository technicianTeamAssignmentRepository,
                              UserNotificationRepository userNotificationRepository) {
        this.utilisateurRepository = utilisateurRepository;
        this.rgieHabilitationRepository = rgieHabilitationRepository;
        this.societeSelectionRepository = societeSelectionRepository;
        this.technicianTeamAssignmentRepository = technicianTeamAssignmentRepository;
        this.userNotificationRepository = userNotificationRepository;
    }

    public UserContextDTO getContext(Long utilisateurId) {
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new ResourceNotFoundException("Technicien non trouvé"));

        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        List<UserContext.Habilitation> habilitations = rgieHabilitationRepository.findByUtilisateurId(utilisateurId).stream()
            .map(entity -> toHabilitation(entity, today))
                .toList();

        UserContext.TeamAssignment teamAssignment = technicianTeamAssignmentRepository
                .findFirstByUtilisateurIdAndEndedAtIsNullOrderByAssignedAtDesc(utilisateurId)
            .map(this::toTeamAssignment)
                .orElse(null);

        long unreadNotifications = userNotificationRepository.countByUtilisateurIdAndReadFalse(utilisateurId);
        long criticalNotifications = habilitations.stream()
            .filter(dto -> dto.status() == RgieHabilitationStatus.TO_RENEW
                || dto.status() == RgieHabilitationStatus.EXPIRED)
                .count();

        UserContext.NotificationSummary notificationSummary = new UserContext.NotificationSummary(
            unreadNotifications,
            criticalNotifications
        );

        UserContext userContext = new UserContext(
            utilisateur.getId(),
            buildFullName(utilisateur),
            utilisateur.getEmail(),
            resolveSelection(utilisateur),
            teamAssignment,
            habilitations,
            notificationSummary
        );

        return UserContextDTO.from(userContext);
    }

        private UserContext.Habilitation toHabilitation(RgieHabilitation entity, LocalDate referenceDate) {
        RgieHabilitationStatus status = computeStatus(entity.getValidUntil(), referenceDate);
        return new UserContext.Habilitation(
            entity.getId(),
            entity.getLabel(),
            entity.getCertificateNumber(),
            entity.getAuthorityLevel(),
            entity.getValidFrom(),
            entity.getValidUntil(),
            status
        );
    }

        private UserContext.TeamAssignment toTeamAssignment(TechnicianTeamAssignment assignment) {
        if (assignment == null) {
            return null;
        }
        var team = assignment.getTeam();
        Long teamId = team != null ? team.getId() : null;
        String teamName = team != null ? team.getName() : null;
        return new UserContext.TeamAssignment(teamId, teamName, assignment.getAssignedAt());
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

        private UserContext.Selection resolveSelection(Utilisateur utilisateur) {
        return societeSelectionRepository
            .findFirstByUtilisateurIdOrderBySelectedAtDesc(utilisateur.getId())
            .map(this::toSelection)
            .orElseGet(() -> fallbackSelection(utilisateur));
        }

        private UserContext.Selection toSelection(SocieteSelection selection) {
        if (selection == null) {
            return null;
        }
        var societe = selection.getSociete();
        Long societeId = societe != null ? societe.getId() : null;
        String societeName = societe != null ? societe.getNom() : null;
        return new UserContext.Selection(
            societeId,
            societeName,
            selection.getRole(),
            selection.getSelectedAt()
        );
        }

        private UserContext.Selection fallbackSelection(Utilisateur utilisateur) {
        List<UserSocieteRole> societes = Optional.ofNullable(utilisateur.getSocietes())
            .orElse(List.of());
        return societes.stream()
            .filter(link -> link.getSociete() != null)
            .sorted(Comparator.comparing(link -> link.getSociete().getId(), Comparator.nullsLast(Long::compareTo)))
            .map(link -> new UserContext.Selection(
                link.getSociete().getId(),
                link.getSociete().getNom(),
                link.getRole(),
                null
            ))
            .findFirst()
            .orElse(null);
        }

    private String buildFullName(Utilisateur utilisateur) {
        return java.util.stream.Stream.of(utilisateur.getPrenom(), utilisateur.getNom())
                .filter(part -> part != null && !part.isBlank())
                .collect(Collectors.joining(" "));
    }
}
