package com.webelec.backend.navigation.dto;

public record NavigationItemDTO(
        String code,
        String label,
        String route,
        String icon
) {
}
