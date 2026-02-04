package com.webelec.backend.service;

import com.webelec.backend.dto.UserContextDTO;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.RgieHabilitation;
import com.webelec.backend.model.Societe;
import com.webelec.backend.model.SocieteSelection;
import com.webelec.backend.model.TechnicianTeam;
import com.webelec.backend.model.TechnicianTeamAssignment;
import com.webelec.backend.model.UserSocieteRole;
import com.webelec.backend.model.Utilisateur;
import com.webelec.backend.model.UtilisateurRole;
import com.webelec.backend.repository.RgieHabilitationRepository;
import com.webelec.backend.repository.SocieteSelectionRepository;
import com.webelec.backend.repository.TechnicianTeamAssignmentRepository;
import com.webelec.backend.repository.UserNotificationRepository;
import com.webelec.backend.repository.UtilisateurRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;
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
    private SocieteSelectionRepository societeSelectionRepository;
    private TechnicianTeamAssignmentRepository technicianTeamAssignmentRepository;
    private UserNotificationRepository userNotificationRepository;
    private UserContextService service;

    @BeforeEach
    void setUp() {
        utilisateurRepository = mock(UtilisateurRepository.class);
        rgieHabilitationRepository = mock(RgieHabilitationRepository.class);
        societeSelectionRepository = mock(SocieteSelectionRepository.class);
        technicianTeamAssignmentRepository = mock(TechnicianTeamAssignmentRepository.class);
        userNotificationRepository = mock(UserNotificationRepository.class);
        service = new UserContextService(
                utilisateurRepository,
                rgieHabilitationRepository,
            societeSelectionRepository,
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
        Societe societe = new Societe();
        societe.setId(7L);
        societe.setNom("Alpha Energies");
        UserSocieteRole link = new UserSocieteRole();
        link.setRole(UtilisateurRole.TECHNICIEN);
        link.setUtilisateur(utilisateur);
        link.setSociete(societe);
        utilisateur.setSocietes(List.of(link));
        when(utilisateurRepository.findById(1L)).thenReturn(Optional.of(utilisateur));

        SocieteSelection selection = new SocieteSelection();
        selection.setSociete(societe);
        selection.setUtilisateur(utilisateur);
        selection.setRole(UtilisateurRole.TECHNICIEN);
        selection.setSelectedAt(Instant.parse("2026-01-12T22:19:43Z"));
        when(societeSelectionRepository.findFirstByUtilisateurIdOrderBySelectedAtDesc(1L))
            .thenReturn(Optional.of(selection));

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
        assertEquals("TECH", dto.getRole());
        assertEquals(2, dto.getHabilitations().size());
        assertEquals(4L, dto.getNotifications().getUnreadCount());
        assertEquals(2L, dto.getNotifications().getCriticalCount());
        assertEquals(7L, dto.getTeam().getTeamId());
        assertEquals(7L, dto.getSelection().getSocieteId());
        assertEquals("Alpha Energies", dto.getSelection().getSocieteName());
        assertEquals("TECH", dto.getSelection().getRole());
        assertEquals(Instant.parse("2026-01-12T22:19:43Z"), dto.getSelection().getSelectedAt());
    }

    @Test
    void getContext_withoutSelection_picksFirstSociete() {
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setId(3L);
        utilisateur.setEmail("multi@webelec.be");

        Societe alpha = new Societe();
        alpha.setId(2L);
        alpha.setNom("Alpha");

        Societe beta = new Societe();
        beta.setId(5L);
        beta.setNom("Beta");

        UserSocieteRole alphaLink = new UserSocieteRole();
        alphaLink.setUtilisateur(utilisateur);
        alphaLink.setSociete(alpha);
        alphaLink.setRole(UtilisateurRole.ADMIN);

        UserSocieteRole betaLink = new UserSocieteRole();
        betaLink.setUtilisateur(utilisateur);
        betaLink.setSociete(beta);
        betaLink.setRole(UtilisateurRole.GERANT);

        utilisateur.setSocietes(List.of(betaLink, alphaLink));

        when(utilisateurRepository.findById(3L)).thenReturn(Optional.of(utilisateur));
        when(societeSelectionRepository.findFirstByUtilisateurIdOrderBySelectedAtDesc(3L))
                .thenReturn(Optional.empty());
        when(rgieHabilitationRepository.findByUtilisateurId(3L)).thenReturn(List.of());
        when(technicianTeamAssignmentRepository
            .findFirstByUtilisateurIdAndEndedAtIsNullOrderByAssignedAtDesc(3L))
            .thenReturn(Optional.empty());
        when(userNotificationRepository.countByUtilisateurIdAndReadFalse(3L)).thenReturn(0L);

        UserContextDTO dto = service.getContext(3L);

        assertEquals("ADMIN", dto.getRole());
        assertEquals(2L, dto.getSelection().getSocieteId());
        assertEquals("Alpha", dto.getSelection().getSocieteName());
    }

    @Test
    void getContext_whenUserMissing_throws() {
        when(utilisateurRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.getContext(2L));
    }
}