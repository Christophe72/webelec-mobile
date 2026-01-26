package com.webelec.backend.controller;

import com.webelec.backend.dto.UserContextDTO;
import com.webelec.backend.service.UserContextService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserContextController {

    private final UserContextService userContextService;

    public UserContextController(UserContextService userContextService) {
        this.userContextService = userContextService;
    }

    @GetMapping("/{id}/context")
    public UserContextDTO getUserContext(@PathVariable Long id) {
        return userContextService.getContext(id);
    }
}
