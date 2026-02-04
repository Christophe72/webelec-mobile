package com.webelec.backend.controller;

import com.webelec.backend.dto.DashboardMetrics;
import com.webelec.backend.dto.UserContextDTO;
import com.webelec.backend.dto.SocieteSelectionDTO;
import com.webelec.backend.model.Societe;
import com.webelec.backend.repository.SocieteRepository;
import com.webelec.backend.security.AuthenticatedUtilisateur;
import com.webelec.backend.service.DashboardService;
import com.webelec.backend.service.UserContextService;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserContextService userContextService;
    private final SocieteRepository societeRepository;
    private final Environment environment;

    public DashboardController(
            DashboardService dashboardService,
            UserContextService userContextService,
            SocieteRepository societeRepository,
            Environment environment
    ) {
        this.dashboardService = dashboardService;
        this.userContextService = userContextService;
        this.societeRepository = societeRepository;
        this.environment = environment;
    }

    @GetMapping("/metrics")
    public DashboardMetrics getMetrics(
            @AuthenticationPrincipal AuthenticatedUtilisateur principal
    ) {
        if (principal == null) {
            if (!environment.acceptsProfiles(Profiles.of("dev"))) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
            }
            // MODE DEV : si pas d'auth, utiliser la première société disponible
            List<Societe> societes = societeRepository.findAll();
            if (societes.isEmpty()) {
                return new DashboardMetrics(0, 0, 0, 0);
            }
            // Utiliser la première société et userId fictif (1L)
            Long societeId = societes.get(0).getId();
            return dashboardService.getDashboardMetrics(societeId, 1L);
        }

        Long userId = principal.getUtilisateur().getId();
        UserContextDTO context = userContextService.getContext(userId);

        SocieteSelectionDTO selection = context.getSelection();
        if (selection == null || selection.getSocieteId() == null) {
            return new DashboardMetrics(0, 0, 0, 0);
        }

        return dashboardService.getDashboardMetrics(
                selection.getSocieteId(),
                userId
        );
    }
}
