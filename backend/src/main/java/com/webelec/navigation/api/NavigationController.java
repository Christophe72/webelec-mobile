package com.webelec.navigation.api;

import com.webelec.navigation.dto.NavigationDTO;
import com.webelec.navigation.service.NavigationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NavigationController {

    private final NavigationService navigationService;

    public NavigationController(NavigationService navigationService) {
        this.navigationService = navigationService;
    }

    @GetMapping("/api/navigation")
    public NavigationDTO getNavigation() {
        return navigationService.getNavigation();
    }
}
