package com.webelec.backend.controller;

import com.webelec.backend.dto.UserContextDTO;
import com.webelec.backend.dto.UserSelectionRequest;
import com.webelec.backend.security.AuthenticatedUtilisateur;
import com.webelec.backend.service.UserSelectionService;
import jakarta.validation.Valid;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserSelectionController {

    private final UserSelectionService userSelectionService;

    public UserSelectionController(UserSelectionService userSelectionService) {
        this.userSelectionService = userSelectionService;
    }

    @PostMapping("/selection")
    public UserContextDTO selectSociete(@Valid @RequestBody UserSelectionRequest request,
                                        @AuthenticationPrincipal AuthenticatedUtilisateur principal) {
        if (principal == null) {
            throw new AccessDeniedException("Utilisateur non authentifié");
        }
        return userSelectionService.selectSociete(principal.getUtilisateur(), request.societeId());
    }
}
