package com.webelec.navigation.dto;

import java.util.List;

public record NavigationSection(
        String code,
        String label,
        List<NavigationItem> items
) {
    public NavigationSection {
        items = items == null ? List.of() : List.copyOf(items);
    }
}
