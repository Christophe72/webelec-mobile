package com.webelec.backend.service;

import com.webelec.backend.dto.UserContextDTO;
import com.webelec.backend.model.SocieteSelection;
import com.webelec.backend.model.UserSocieteRole;
import com.webelec.backend.model.Utilisateur;
import com.webelec.backend.repository.SocieteSelectionRepository;
import com.webelec.backend.repository.UserSocieteRoleRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class UserSelectionService {

    private final UserSocieteRoleRepository userSocieteRoleRepository;
    private final SocieteSelectionRepository societeSelectionRepository;
    private final UserContextService userContextService;

    public UserSelectionService(UserSocieteRoleRepository userSocieteRoleRepository,
                                SocieteSelectionRepository societeSelectionRepository,
                                UserContextService userContextService) {
        this.userSocieteRoleRepository = userSocieteRoleRepository;
        this.societeSelectionRepository = societeSelectionRepository;
        this.userContextService = userContextService;
    }

    @Transactional
    public UserContextDTO selectSociete(Utilisateur utilisateur, Long societeId) {
        if (utilisateur == null || utilisateur.getId() == null) {
            throw new AccessDeniedException("Utilisateur non authentifié");
        }
        UserSocieteRole link = userSocieteRoleRepository
                .findByUtilisateurIdAndSocieteId(utilisateur.getId(), societeId)
                .orElseThrow(() -> new AccessDeniedException("Accès refusé à cette société"));

        if (link.getSociete() == null) {
            throw new AccessDeniedException("Société introuvable pour cet utilisateur");
        }

        SocieteSelection selection = new SocieteSelection(utilisateur, link.getSociete(), link.getRole());
        selection.setSelectedAt(Instant.now());
        societeSelectionRepository.saveAndFlush(selection);

        return userContextService.getContext(utilisateur.getId());
    }
}
