package com.webelec.backend.service;

import com.webelec.backend.dto.UserContextDTO;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.RgieHabilitation;
import com.webelec.backend.model.TechnicianTeam;
import com.webelec.backend.model.TechnicianTeamAssignment;
import com.webelec.backend.model.UserSocieteRole;
import com.webelec.backend.model.Utilisateur;
import com.webelec.backend.model.UtilisateurRole;
import com.webelec.backend.repository.RgieHabilitationRepository;
import com.webelec.backend.repository.TechnicianTeamAssignmentRepository;
import com.webelec.backend.repository.UserNotificationRepository;
import com.webelec.backend.repository.UtilisateurRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class UserContextServiceTest {

    private UtilisateurRepository utilisateurRepository;
    private RgieHabilitationRepository rgieHabilitationRepository;
    private TechnicianTeamAssignmentRepository technicianTeamAssignmentRepository;
    private UserNotificationRepository userNotificationRepository;
    private UserContextService service;

    @BeforeEach
    void setUp() {
        utilisateurRepository = mock(UtilisateurRepository.class);
        rgieHabilitationRepository = mock(RgieHabilitationRepository.class);
        technicianTeamAssignmentRepository = mock(TechnicianTeamAssignmentRepository.class);
        userNotificationRepository = mock(UserNotificationRepository.class);
        service = new UserContextService(
                utilisateurRepository,
                rgieHabilitationRepository,
                technicianTeamAssignmentRepository,
                userNotificationRepository
        );
    }

    @Test
    void getContext_returnsAggregatedData() {
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setId(1L);
        utilisateur.setPrenom("Alexandre");
        utilisateur.setNom("Leroy");
        utilisateur.setEmail("alexandre@webelec.be");
        UserSocieteRole link = new UserSocieteRole();
        link.setRole(UtilisateurRole.TECHNICIEN);
        link.setUtilisateur(utilisateur);
        utilisateur.setSocietes(List.of(link));
        when(utilisateurRepository.findById(1L)).thenReturn(Optional.of(utilisateur));

        RgieHabilitation needRenewal = new RgieHabilitation();
        needRenewal.setId(10L);
        needRenewal.setLabel("BA5");
        needRenewal.setCertificateNumber("RGIE-001");
        needRenewal.setAuthorityLevel("BA5");
        needRenewal.setValidFrom(LocalDate.now().minusMonths(6));
        needRenewal.setValidUntil(LocalDate.now().plusDays(10));

        RgieHabilitation expired = new RgieHabilitation();
        expired.setId(11L);
        expired.setLabel("BA4");
        expired.setValidFrom(LocalDate.now().minusYears(1));
        expired.setValidUntil(LocalDate.now().minusDays(3));

        when(rgieHabilitationRepository.findByUtilisateurId(1L)).thenReturn(List.of(needRenewal, expired));

        TechnicianTeam team = new TechnicianTeam();
        team.setId(7L);
        team.setName("Equipe RGIE");
        TechnicianTeamAssignment assignment = new TechnicianTeamAssignment();
        assignment.setTeam(team);
        assignment.setAssignedAt(LocalDate.now().minusMonths(1));
        assignment.setUtilisateur(utilisateur);
        when(technicianTeamAssignmentRepository
                .findFirstByUtilisateurIdAndEndedAtIsNullOrderByAssignedAtDesc(1L))
                .thenReturn(Optional.of(assignment));

        when(userNotificationRepository.countByUtilisateurIdAndReadFalse(1L)).thenReturn(4L);

        UserContextDTO dto = service.getContext(1L);

        assertEquals("Alexandre Leroy", dto.getFullName());
        assertEquals("TECHNICIEN", dto.getRole());
        assertEquals(2, dto.getHabilitations().size());
        assertEquals(4L, dto.getNotifications().getUnreadCount());
        assertEquals(2L, dto.getNotifications().getCriticalCount());
        assertEquals(7L, dto.getTeam().getTeamId());
    }

    @Test
    void getContext_whenUserMissing_throws() {
        when(utilisateurRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.getContext(2L));
    }
}