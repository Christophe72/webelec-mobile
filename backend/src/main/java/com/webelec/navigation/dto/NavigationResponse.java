package com.webelec.navigation.dto;

import java.util.List;

public record NavigationResponse(
        List<NavigationSection> sections
) {
    public NavigationResponse {
        sections = sections == null ? List.of() : List.copyOf(sections);
    }
}
