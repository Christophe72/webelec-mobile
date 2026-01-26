package com.webelec.backend.controller;

import com.webelec.backend.security.AuthenticatedUtilisateur;
import com.webelec.backend.service.UserPriorityAckService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/priorities")
public class PriorityAckController {

    private final UserPriorityAckService service;

    public PriorityAckController(UserPriorityAckService service) {
        this.service = service;
    }

    @PostMapping("/{priorityId}/ack")
    public ResponseEntity<Void> acknowledge(
        @PathVariable String priorityId,
        @AuthenticationPrincipal AuthenticatedUtilisateur principal
    ) {
        if (principal == null) {
            throw new AccessDeniedException("Utilisateur non authentifié");
        }

        service.acknowledge(principal.getUtilisateur().getId(), priorityId);
        return ResponseEntity.noContent().build();
    }
}
