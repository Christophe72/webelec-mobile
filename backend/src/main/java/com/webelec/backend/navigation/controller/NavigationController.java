package com.webelec.backend.navigation.controller;

import com.webelec.backend.navigation.dto.NavigationDTO;
import com.webelec.backend.navigation.service.NavigationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NavigationController {

    private final NavigationService navigationService;

    public NavigationController(NavigationService navigationService) {
        this.navigationService = navigationService;
    }

    @GetMapping("/api/users/{userId}/navigation")
    public NavigationDTO getNavigation(@PathVariable("userId") Long userId) {
        return navigationService.getNavigation(userId);
    }
}
