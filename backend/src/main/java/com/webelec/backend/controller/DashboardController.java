package com.webelec.backend.controller;

import com.webelec.backend.dto.DashboardMetrics;
import com.webelec.backend.dto.UserContextDTO;
import com.webelec.backend.dto.SocieteSelectionDTO;
import com.webelec.backend.security.AuthenticatedUtilisateur;
import com.webelec.backend.service.DashboardService;
import com.webelec.backend.service.UserContextService;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@Profile("dev")
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserContextService userContextService;

    public DashboardController(
            DashboardService dashboardService,
            UserContextService userContextService
    ) {
        this.dashboardService = dashboardService;
        this.userContextService = userContextService;
    }

    @GetMapping("/metrics")
    public DashboardMetrics getMetrics(
            @AuthenticationPrincipal AuthenticatedUtilisateur principal
    ) {
        if (principal == null) {
            return new DashboardMetrics(0, 0, 0, 0);
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
