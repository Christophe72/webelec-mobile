package com.webelec.backend.service;

import com.webelec.backend.dto.UserContextDTO;
import com.webelec.backend.dto.NotificationSummaryDTO;
import com.webelec.backend.model.Societe;
import com.webelec.backend.model.SocieteSelection;
import com.webelec.backend.model.UserSocieteRole;
import com.webelec.backend.model.Utilisateur;
import com.webelec.backend.model.UtilisateurRole;
import com.webelec.backend.repository.SocieteSelectionRepository;
import com.webelec.backend.repository.UserSocieteRoleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.access.AccessDeniedException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserSelectionServiceTest {

    private UserSocieteRoleRepository userSocieteRoleRepository;
    private SocieteSelectionRepository societeSelectionRepository;
    private UserContextService userContextService;
    private UserSelectionService service;

    @BeforeEach
    void setUp() {
        userSocieteRoleRepository = mock(UserSocieteRoleRepository.class);
        societeSelectionRepository = mock(SocieteSelectionRepository.class);
        userContextService = mock(UserContextService.class);
        service = new UserSelectionService(userSocieteRoleRepository, societeSelectionRepository, userContextService);
    }

    @Test
    void selectSociete_whenUserLinked_returnsUpdatedContext() {
        Utilisateur utilisateur = buildUser(12L);
        Societe societe = buildSociete(33L, "Volt");
        UserSocieteRole link = buildLink(utilisateur, societe, UtilisateurRole.GERANT);

        when(userSocieteRoleRepository.findByUtilisateurIdAndSocieteId(12L, 33L))
                .thenReturn(Optional.of(link));

        UserContextDTO expected = UserContextDTO.builder()
                .userId(12L)
                .email("alex@webelec.be")
                .notifications(new NotificationSummaryDTO(0, 0))
                .build();
        when(userContextService.getContext(12L)).thenReturn(expected);

        UserContextDTO result = service.selectSociete(utilisateur, 33L);

        assertSame(expected, result);
        verify(userContextService).getContext(12L);
    }

    @Test
    void selectSociete_whenUserNotLinked_throwsAccessDenied() {
        Utilisateur utilisateur = buildUser(8L);
        when(userSocieteRoleRepository.findByUtilisateurIdAndSocieteId(8L, 77L))
                .thenReturn(Optional.empty());

        assertThrows(AccessDeniedException.class, () -> service.selectSociete(utilisateur, 77L));
        verify(societeSelectionRepository, never()).saveAndFlush(any(SocieteSelection.class));
        verifyNoInteractions(userContextService);
    }

    @Test
    void selectSociete_appendsNewSelectionRow() {
        Utilisateur utilisateur = buildUser(5L);
        Societe societe = buildSociete(99L, "Omega");
        UserSocieteRole link = buildLink(utilisateur, societe, UtilisateurRole.TECHNICIEN);
        when(userSocieteRoleRepository.findByUtilisateurIdAndSocieteId(5L, 99L))
                .thenReturn(Optional.of(link));

        UserContextDTO context = UserContextDTO.builder()
                .userId(5L)
                .notifications(new NotificationSummaryDTO(0, 0))
                .build();
        when(userContextService.getContext(5L)).thenReturn(context);

        service.selectSociete(utilisateur, 99L);

        ArgumentCaptor<SocieteSelection> captor = ArgumentCaptor.forClass(SocieteSelection.class);
        verify(societeSelectionRepository).saveAndFlush(captor.capture());
        SocieteSelection persisted = captor.getValue();
        assertEquals(utilisateur, persisted.getUtilisateur());
        assertEquals(societe, persisted.getSociete());
        assertEquals(UtilisateurRole.TECHNICIEN, persisted.getRole());
        assertNotNull(persisted.getSelectedAt());
    }

    private Utilisateur buildUser(Long id) {
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setId(id);
        utilisateur.setEmail("user" + id + "@webelec.be");
        return utilisateur;
    }

    private Societe buildSociete(Long id, String name) {
        Societe societe = new Societe();
        societe.setId(id);
        societe.setNom(name);
        return societe;
    }

    private UserSocieteRole buildLink(Utilisateur utilisateur, Societe societe, UtilisateurRole role) {
        UserSocieteRole link = new UserSocieteRole();
        link.setUtilisateur(utilisateur);
        link.setSociete(societe);
        link.setRole(role);
        return link;
    }
}
