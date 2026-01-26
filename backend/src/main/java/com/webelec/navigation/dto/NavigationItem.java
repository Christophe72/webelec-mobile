package com.webelec.navigation.dto;

public record NavigationItem(
        String code,
        String label,
        String route,
        String icon,
        boolean active
) {
}
