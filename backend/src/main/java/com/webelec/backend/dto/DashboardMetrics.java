package com.webelec.backend.dto;

public record DashboardMetrics(
    Integer activeSitesCount,
    Integer stockAlertsCount,
    Integer rgieAlertsCount,
    Integer criticalNotificationsCount
) {}
