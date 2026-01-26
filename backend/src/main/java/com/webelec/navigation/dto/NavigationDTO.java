package com.webelec.backend.navigation.dto;

import java.util.List;

public record NavigationDTO(
        Long userId,
        Long companyId,
        String role,
        List<NavigationSectionDTO> sections
) {
    public NavigationDTO {
        sections = sections == null ? List.of() : List.copyOf(sections);
    }
}
