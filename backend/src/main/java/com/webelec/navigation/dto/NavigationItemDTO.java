package com.webelec.navigation.dto;

public record NavigationItemDTO(
        String code,
        String label,
        String route,
        String icon,
        boolean active
) {
}
