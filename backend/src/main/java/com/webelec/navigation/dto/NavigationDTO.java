package com.webelec.navigation.dto;

import java.util.List;

public record NavigationDTO(
        List<NavigationSectionDTO> sections
) {
    public NavigationDTO {
        sections = sections == null ? List.of() : List.copyOf(sections);
    }
}
