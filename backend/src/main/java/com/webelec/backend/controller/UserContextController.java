package com.webelec.backend.controller;

import com.webelec.backend.dto.UserContextDTO;
import com.webelec.backend.model.UserPriorityAck;
import com.webelec.backend.security.AuthenticatedUtilisateur;
import com.webelec.backend.service.UserContextService;
import com.webelec.backend.service.UserPriorityAckService;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Profile;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api/user")
@Profile("dev")
public class UserContextController {

    private final UserPriorityAckService priorityAckService;

    public UserContextController(UserPriorityAckService priorityAckService) {
        this.priorityAckService = priorityAckService;
    }

    @GetMapping("/context")
    public Map<String, Object> getUserContext(@AuthenticationPrincipal AuthenticatedUtilisateur principal) {
        List<Map<String, Object>> acknowledgedPriorities = List.of();

        if (principal != null) {
            acknowledgedPriorities = priorityAckService.getAcknowledgedPrioritiesWithTimestamp(principal.getUtilisateur().getId())
                .stream()
                .map(ack -> Map.of(
                    "priorityId", (Object) ack.getPriorityId(),
                    "acknowledgedAt", (Object) ack.getAcknowledgedAt().toString()
                ))
                .collect(Collectors.toList());
        }

        return Map.of(
            "events", List.of(
                Map.of(
                    "id", "evt-1",
                    "severity", "WARNING",
                    "message", "Stock faible : Disjoncteurs 16A",
                    "entityType", "STOCK",
                    "entityId", "STOCK-001",
                    "createdAt", Instant.now().toString()
                )
            ),
            "acknowledgedPriorities", acknowledgedPriorities
        );
    }
}

