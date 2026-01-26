package com.webelec.backend.navigation.dto;

import java.util.List;

public record NavigationSectionDTO(
        String code,
        String label,
        List<NavigationItemDTO> items
) {
    public NavigationSectionDTO {
        items = items == null ? List.of() : List.copyOf(items);
    }
}
